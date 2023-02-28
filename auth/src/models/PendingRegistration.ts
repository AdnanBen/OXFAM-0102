import mongoose, { Document, Schema } from "mongoose";

export interface IPendingRegistrationModel extends Document {}

const PendingRegistrationSchema: Schema = new Schema(
  {
    email: { type: String, unique: true },
  },
  {
    versionKey: false,
    // No fixed schema; can have any fields, as received from AD
    strict: false,
  }
);

export default mongoose.model<IPendingRegistrationModel>(
  "PendingRegistration",
  PendingRegistrationSchema
);
