The `trends` microservice is used to collect and process interesting statistics from around the platform.

## Architecture

This is an [Express](https://expressjs.com/) API connecting to a [MongoDB](https://www.mongodb.com/) database.

## Public endpoints

### GET

- `GET /trends/incompletereports/getall` -- returns incomplete reports data
- `GET /trends/resourceViews/` -- returns resource views
