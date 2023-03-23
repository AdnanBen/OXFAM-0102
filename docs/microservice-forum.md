This microservice manages the forum (boards, forum posts, moderator commands).

## Architecture

This is an [Express](https://expressjs.com/) API connecting to a [PostgreSQL database](https://www.postgresql.org/).

!> Whilst most other microservices in this platform use MongoDB, PostgreSQL is used for the Forum as it can capture relationships between posts, boards, comments (and nested replies) much more effectively than a non-relational database can.

## Public endpoints

### GET

- `GET /boards` -- returns list of boards in the system.
- `GET /tags` -- returns list of tags in the system.
- `GET /posts` -- returns all non-deleted posts (exc. body and comments) in the system, optionally filterable by a `board_id` query parameter.
- `GET /posts/:id` -- returns all details for the given post `id`, including body and comments.

### POST

- `POST /posts` -- creates a new post with a JSON request body of `body`, `title`, and `board_id`.
- `POST /posts/:id/comments` -- creates a new comment on the given post `id` with a JSON request body of `body`, and optionally `parentCommentId` (if the comment is a reply).
- `POST /posts/:id/flags` -- flags the given post `id` as spam/abusive for moderator attention.
- `POST /comments/:id/flags` -- flags the given comment `id` as spam/abusive for moderator attention.

## Moderator endpoints

### GET

- `GET /moderator/comments/flagged` -- returns all non-deleted flagged comments
- `GET /moderator/posts/flagged` -- returns all non-deleted flagged posts

### DELETE

- `DELETE /moderator/comments/:id/flags` -- dismisses the given comment `id`'s flags (resets the counter to 0)
- `DELETE /moderator/comments/:id` -- deletes the given comment `id` (soft-delete)
- `DELETE /moderator/posts/:id/flags` -- dismisses the post `id`'s flags (resets the counter to 0)
- `DELETE /moderator/posts/:id` -- deletes the given post `id`'s (soft-delete)

## Tests

The API exposed by this microservice is unit-tested using [Jest](https://jestjs.io/).

To sufficiently test the functionality, the database is not mocked, but a test instance is spun up in a Docker container and thrown away afterwards. A unique PostgreSQL schema is used per test file, and the database is truncated (cleared) after every test so that each test is independent.

## Cloudflare Turnstile

To protect the forum from bots we deployed a CAPTCHA using Cloudflare's Turnstile technology. All of the above listed POST actions are protected by the CAPTCHA. The CAPTCHA is currently configured to use the invisible mode in the Turnstile dashboard so there is minimal impact on the user experience. The library that we used to implement the Turnstile CAPTCHA can be found [here](https://github.com/marsidev/react-turnstile).
