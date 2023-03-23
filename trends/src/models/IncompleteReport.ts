import mongoose, { Document, Schema } from "mongoose";

export interface IIncompleteReport {
  name: string;
  info: string;
}

export interface IIncompleteReportModel extends IIncompleteReport, Document {}

const IncompleteReportSchema: Schema = new Schema(
  {
    reportId: { type: String, required: false },
    info: { type: String, required: false },
  },
  {
    versionKey: false,
  }
);

export default mongoose.model<IIncompleteReportModel>(
  "IncompleteReport",
  IncompleteReportSchema
);
