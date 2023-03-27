The `resources` microservice is used to facilitate the creation and viewing of self-help resources for survivors.

## Architecture

This is an [Express](https://expressjs.com/) API connecting to a [MongoDB](https://www.mongodb.com/) database.

## Public endpoints

### GET

- `GET /resources/` -- returns all resources in the system, optionally filtering by a `category` query parameter.
- `GET /resources/:id` -- returns the given resources `id`'s details.
- `GET /resources/titles` -- returns the titles only of all resources in the system.

## Moderator endpoints

### POST

- `POST /moderator/resources/` -- creates a new resource with the JSON request body of `title`, `body`, and `category`.

### PATCH

- `PATCH /moderator/resources/:id` -- updates the given resource `id` with a JSON request body of at least one of `title`, `body`, `category`.

### DELETE

- `DELETE /moderator/resources/:id` -- deletes the given resource `id`.

## Tests

The API exposed by this microservice is unit-tested using [Jest](https://jestjs.io/).

To sufficiently test the functionality, the database is not mocked, but an in-memory MongoDB instance is used through [`mongodb-memory-server`](https://github.com/nodkz/mongodb-memory-server), and the database is truncated (cleared) after every test so that each test is independent.

To run the tests:

1. Install dependencies

   ```bash
   cd reports
   pnpm install
   ```

2. Run the tests

   ```bash
   cd reports
   pnpm test
   ```
