import mongoose, { Document, Schema } from "mongoose";

export interface IArticle {
  title: string;
  body: string;
}

export interface IArticleModel extends IArticle, Document {}

const ArticleSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    body: { type: String, required: true },
    category: { type: String, required: true },
  },
  {
    versionKey: false,
  }
);

export default mongoose.model<IArticleModel>("Article", ArticleSchema);
