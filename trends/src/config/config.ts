import dotenv from "dotenv";

dotenv.config();

const MONGO_USERNAME = process.env.MONGO_USERNAME;
const MONGO_PASSWORD = process.env.MONGO_PASSWORD;

const DATABASE_URL = process.env.DATABASE_URL;
const DATABASE_PORT = process.env.DATABASE_PORT;

const DATABASE_NAME = process.env.DATABASE_NAME;

const MONGO_URL = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${DATABASE_URL}:27019/${DATABASE_NAME}`;

const SERVER_PORT = process.env.PORT;

export const config = {
  mongo: {
    url: MONGO_URL,
  },
  server: {
    port: +SERVER_PORT!,
  },
};
