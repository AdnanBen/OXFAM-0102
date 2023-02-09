import mongoose, { Document, Schema } from "mongoose";

export interface IReport {
  name: string;
  gender: string;
  body: string;
}

export interface IReportModel extends IReport, Document {}

const ReportSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    gender: { type: String, required: true },
    body: { type: String, required: true },
  },
  {
    versionKey: false,
  }
);

export default mongoose.model<IReportModel>("Report", ReportSchema);
