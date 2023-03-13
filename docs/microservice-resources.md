The `resources` microservice is used to facilitate the creation and viewing of self-help resources for survivors.

## Architecture

This is an [Express](https://expressjs.com/) API connecting to a [MongoDB](https://www.mongodb.com/) database.

## Public endpoints

### GET

- `GET /` -- returns all resources in the system, optionally filtering by a `category` query parameter.
- `GET /:id` -- returns the given resources `id`'s details.
- `GET /titles` -- returns the titles only of all resources in the system.

## Moderator endpoints

### POST

- `POST /` -- creates a new resource with the JSON request body of `title`, `body`, and `category`.

### PATCH

- `PATCH /:id` -- updates the given resource `id` with a JSON request body of at least one of `title`, `body`, `category`.

### DELETE

- `DELETE /:id` -- deletes the given resource `id`.
