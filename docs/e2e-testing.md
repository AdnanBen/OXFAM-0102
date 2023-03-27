## Overview

The E2E test suite tests the entire platform as a whole using [Puppeteer](https://pptr.dev/), an API for controlling headless browsers.

These aim to test the entire system is integrated correctly and work as intended, as there are lots of moving parts in this platform due to the microservice architecture. In particular, these tests simulate how a real user would use the web-platform, and ensures the corresponding actions succeed.

To do this, all microservices are spun up within Docker (inc. APIs and databases). This aims to match the production environment as close as possible.

Then, a custom Jest test environment has been configured to spawn a new browser instance using Puppeteer, and defines global variables for the entire test suite.

One of the most complex parts of the E2E test suite is how databases are tested; each microservice has its own database, and these are exposed to the Docker host via a standard port. However, these need to be unique so as to not clash. Therefore, the Jest test environment defines these ports as global variables, for individual tests to connect to when testing a specific feature.

!> The database ports also need to be configured in the `run-e2e.sh` script.

Each test suite is responsible for connecting to, disconnecting from, and clearing any databases they need to test. For example, the forum E2E tests might connect to the PostgreSQL database at port `global.databasePorts.forum` on the `beforeAll` hook, and disconnect on the `afterAll` hook, and run a `TRUNCATE` SQL command on the `beforeEach` hook.

## Running tests

1. Start the Docker containers

   ```bash
   ./rune-e2e.sh
   ```

2. Install dependencies

   ```bash
   cd survivor-frontend
   pnpm install
   ```

3. Run the tests

   ```bash
   cd survivor-frontend
   pnpm test:e2e
   ```
