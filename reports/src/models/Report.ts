import mongoose, { Document, Schema } from "mongoose";

export interface IReport {
  name: string;
  situation: string;
}

export interface IReportModel extends IReport, Document {}

const ReportSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    situation: { type: String, required: true },
  },
  {
    versionKey: false,
  }
);

export default mongoose.model<IReportModel>("Report", ReportSchema);
