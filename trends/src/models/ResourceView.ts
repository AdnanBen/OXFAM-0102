import mongoose, { Document, Schema } from "mongoose";

export interface IResourceView {
  resourceId: string;
}

export interface IResourceViewModel extends IResourceView, Document {}

const ResourceViewSchema: Schema = new Schema(
  {
    resourceId: { type: String, required: true },
    timestamp: { type: Number, required: true },
  },
  {
    versionKey: false,
  }
);

export default mongoose.model<IResourceViewModel>(
  "ResourceView",
  ResourceViewSchema
);
