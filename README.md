# OXFAM-0102

## Developing locally

1. Start all the databases for all the microservices, and Next.js server:

   ```bash
   ./run.sh
   ```

2. In a new shell, change to your microservice's directory:

   ```bash
   cd [microservice]
   ```

3. Update your `.env` file to make sure any URLs say `localhost` and update the database port to be the one hardcoded in [`./run.sh`](./run.sh) for your microservice

4. Run your individual microservice API using:

   ```bash
   docker-compose up -d
   ```

5. Access the frontend at [http://localhost](http://localhost)

For each microservice you want to test locally, you will need to run their own API in a new shell!

**DO NOT COMMIT CHANGES TO `.env` UNLESS YOU NEED TO.**
