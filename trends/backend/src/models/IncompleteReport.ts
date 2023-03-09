import mongoose, { Document, Schema } from "mongoose";

export interface IIncompleteReport {
  name: string;
  body: string;
}

export interface IIncompleteReportModel extends IIncompleteReport, Document {}

const IncompleteReportSchema: Schema = new Schema(
  {
    reportId: { type: String, required: true },
    info: { type: String, required: true },
  },
  {
    versionKey: false,
  }
);

export default mongoose.model<IIncompleteReportModel>("IncompleteReport", IncompleteReportSchema);
