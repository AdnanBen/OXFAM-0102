import { Db, MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const client = new MongoClient(process.env.DATABASE_URL);
var connectedClient: Db;

const connectToDb = async () => {
  const db = await client.connect();
  connectedClient = db.db(process.env.DATABASE_NAME);
};

connectToDb();

export const connect = connectToDb;
export const getDb = () => connectedClient;
