import { Db } from "mongodb";

export const getNextMongoSequenceValue = async (db: Db, collectionName: string) => {
  const doc = await db
    .collection("counters")
    .findOneAndUpdate(
      { _id: collectionName },
      { $inc: { sequence_value: 1 } },
      { upsert: true }
    );

  return doc?.value?.sequence_value ?? null;
};

export class APIError extends Error {
  status: number;

  constructor(status: number, message: string, ...params) {
    super(...params);
    this.status = status;
    this.name = 'APIError';
    this.message = message;
  }
}
