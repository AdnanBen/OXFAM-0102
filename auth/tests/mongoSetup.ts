import { MongoMemoryServer } from "mongodb-memory-server-core";
import mongoose from "mongoose";

export default async function setup() {
  // Create unique in-memory instance per test file
  const mongo = await MongoMemoryServer.create();
  process.env.MONGO_URL = mongo.getUri();

  await mongoose.connect(mongo.getUri());
  await mongoose.connection.db.dropDatabase();
  await mongoose.disconnect();
}
