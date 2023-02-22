import mongoose, { Document, Schema } from "mongoose";

export interface IPendingRegistrationModel extends Document {}

// No fixed schema; can have any fields, as received from AD
const PendingRegistrationSchema: Schema = new Schema(
  {},
  { versionKey: false, strict: false }
);

export default mongoose.model<IPendingRegistrationModel>(
  "PendingRegistration",
  PendingRegistrationSchema
);
