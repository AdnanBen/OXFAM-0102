The `reports` microservice is used to facilitate reports of abuse by survivors.

!> This microservice is the only microservice that explicitly collects personally-identifiable information (PII), as it is intended to be used by Oxfam to help provide urgent individual help to survivors.

## Architecture

This is an [Express](https://expressjs.com/) API connecting to a [MongoDB](https://www.mongodb.com/) database.

## Public endpoints
### POST

- `POST /reports/completereports/` -- creates a new report with the JSON request body of `title`, `body`
- `POST /reports/incompletereports/` --  creates a new incomplete report datum with the JSON request body of `title`, `body`

## Moderator endpoints

### GET

- `GET /moderators/reports/completereports/` -- returns all reports in the system
- `GET /moderators/reports/completereports/:reportId` -- returns the given report `reportId`

### DELETE

- `DELETE /moderator/reports/completereports/:reportId` -- deletes the given report `reportId`.
## Tests

The API exposed by this microservice is unit-tested using [Jest](https://jestjs.io/).

To sufficiently test the functionality, the database is not mocked, but an in-memory MongoDB instance is used through [`mongodb-memory-server`](https://github.com/nodkz/mongodb-memory-server), and the database is truncated (cleared) after every test so that each test is independent.
