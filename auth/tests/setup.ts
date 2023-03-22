import { afterEach, beforeEach } from "@jest/globals";
import mongoose from "mongoose";

beforeEach(async () => {
  await mongoose.connect(process.env.MONGO_URL!);
});

afterEach(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.disconnect();
});
