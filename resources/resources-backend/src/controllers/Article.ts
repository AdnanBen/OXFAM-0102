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

const getAll = (req: Request, res: Response, next: NextFunction) => {
  return Article.find()
    .then((articles) => res.status(201).json({ articles }))
    .catch((error) => res.status(500).json({ error }));
};

export default { createArticle, getAll };
