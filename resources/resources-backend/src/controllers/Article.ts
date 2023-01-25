import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import Article from "../models/Article";

const createArticle = (req: Request, res: Response, next: NextFunction) => {
  console.log(req.body);
  const { title, body, category } = req.body;

  const article = new Article({
    _id: new mongoose.Types.ObjectId(),
    title,
    body,
    category,
  });

  return article
    .save()
    .then((article) => res.status(201).json({ article }))
    .catch((error) => res.status(500).json({ error }));
};

const getArticle = (req: Request, res: Response, next: NextFunction) => {
  const articleId = req.params.articleId;

  return Article.findById(articleId)
    .then((article) =>
      article
        ? res.status(200).json({ article })
        : res.status(404).json({ message: "Article not found" })
    )
    .catch((error) => res.status(500).json({ error }));
};

const getAll = (req: Request, res: Response, next: NextFunction) => {
  return Article.find()
    .then((articles) => res.status(201).json({ articles }))
    .catch((error) => res.status(500).json({ error }));
};

const getAllTitles = (req: Request, res: Response, next: NextFunction) => {
  return Article.find({}, "_id, title")
    .then((articles) => res.status(201).json({ articles }))
    .catch((error) => res.status(500).json({ error }));
};

const getByCategory = (req: Request, res: Response, next: NextFunction) => {
  console.log(req.query);
  const categoryParam = req.query?.category;

  return Article.find({ category: categoryParam })
    .then((articles) => res.status(201).json({ articles }))
    .catch((error) => res.status(500).json({ error }));
};

const updateArticle = (req: Request, res: Response, next: NextFunction) => {
  const articleId = req.params.articleId;

  return Article.findById(articleId)
    .then((article) => {
      if (article) {
        article.set(req.body);

        return article
          .save()
          .then((article) => res.status(201).json({ article }))
          .catch((error) => res.status(500).json({ error }));
      } else {
        res.status(404).json({ message: "Article not found" });
      }
    })
    .catch((error) => res.status(500).json({ error }));
};

const deleteArticle = (req: Request, res: Response, next: NextFunction) => {
  const articleId = req.params.articleId;

  return Article.findByIdAndDelete(articleId)
    .then((article) =>
      article
        ? res.status(201).json({ message: "Article Deleted" })
        : res.status(404).json({ message: "Article not found" })
    )
    .catch((error) => res.status(500).json({ error }));
};

export default {
  createArticle,
  getArticle,
  getAll,
  getAllTitles,
  getByCategory,
  updateArticle,
  deleteArticle,
};
