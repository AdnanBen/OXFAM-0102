Running the platform locally consists of running microservice(s), the frontend, and the gateway.

It is highly recommended in most cases to run a subset of all the microservices when developing locally, unless you are trying to test the entire system or are working across all microservices at the same time.

## Overview of Docker Compose configurations

There are 3 (or 4, sometimes) Docker Compose configurations for each microservice:

- `docker-compose.yml` -- intended for use during development, containing only databases and other containers that are _not_ the main API itself
- `docker-compose-e2e.yml` -- indended for use during [end-to-end testing](./e2e-testing.md)
- `docker-compose-test.yml` -- intended for use during unit testing (only applicable to the [forum](./microservice-forum.md) at the moment, due to its requirement for a full PostgreSQL instance during testing)
- `docker-compose-prod.yml` -- intended for use in production

The differences between all configurations are relatively small, but important. For example: the test configurations do not persist any data (there are no volumes); production configurations include additional setup like for TLS (HTTPS); development configurations do not include the main API.

?> Development configurations do not include the main API because it is easier to run the APIs on your host machine during active development. This means that the API on your host needs to be run separately, which connects to the respective database in the Docker containers.

## Working on a microservice API locally

There are a few steps needed to run a microservice locally:

1. Copy `.env` to `.env.local` and update the respective environment variables if needed

   ```bash
   cd [microservice]
   cp .env .env.local
   ```

   - In most cases, you will _not_ need to update `LOCAL_DB_PORT` or `DATABASE_URL`/`MONGO_URL`, as these are pre-configured in the checked-in `.env` to ensure all microservices use a different port for their database. This is important because when running locally, each database's port is published to the host, so there cannot be any conflicts.
   - In most cases, you will also _not_ need to update the `PORT`, as these are also pre-configured to ensure all microservices publish the API on a different port, and the development gateway is also pre-configured to use these same ports.

2. Run the development Docker Compose configuration:

   ```bash
   cd [microservice]
   docker-compose up -d
   ```

3. Run the API in a dedicated shell (and install dependencies)

   ```bash
   cd [microservice]
   pnpm install
   pnpm start
   ```

`pnpm start` will now run the API on your host, using the environment variables in `.env.local`, connecting to the database inside Docker.

## Using the frontend locally

Running the microservice API is usually not enough unless you are testing the API via Postman/another HTTP/REST API testing tool. In most cases you'll also want to test the frontend. To do this:

1. Start the frontend in a dedicated shell

   a. Copy `.env` to `.env.local` and update the respective environment variables as needed.

   ```bash
     cd survivor-frontend
     cp .env .env.local
   ```

   b. Start the frontend

   ```bash
   cd survivor-frontend
   pnpm install
   pnpm dev
   ```

2. Start the gateway
   ```bash
   cd gateway
   docker-compose up -d
   ```

The frontend should now be accessible at [http://localhost](http://localhost).

!> The gateway has multiple configurations for development, production, and testing. The development configuration checked-in to Git has pre-defined ports corresponding to each microservice's environment variables, therefore you should _not_ need to edit any ports when running locally.

!> We need to use the gateway when running locally as this enables all microservices to run on the same port, therefore not requiring CORS rules, and it forwards all requests to the appropriate microservices, so you do not need to configure bespoke URLs separate for each microservice.
