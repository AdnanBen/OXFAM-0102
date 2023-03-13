The `resources` microservice is used to facilitate the creation and viewing of self-help resources for survivors.

## Architecture

This is an [Express](https://expressjs.com/) API connecting to a [MongoDB](https://www.mongodb.com/) database.

## Public endpoints

### GET

- `GET /articles/get/:id` -- returns the given resources `id`'s details.
- `GET /articles/getall` -- returns all resources in the system.
- `GET /articles/getalltitles` -- returns the titles only of all resources in the system.
- `GET /articles/getbycategory` -- returns all resources matching the given `category` query parameter.

## Moderator endpoints

### POST

- `POST /articles/create` -- creates a new resource with the JSON request body of `title`, `body`, and `category`.

### PATCH

- `PATCH /articles/update/:id` -- updates the given resource `id` with a JSON request body of at least one of `title`, `body`, `category`.

### DELETE

- `DELETE /articles/delete/:id` -- deletes the given resource `id`.
