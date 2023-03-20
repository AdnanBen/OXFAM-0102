import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import amqplib from "amqplib";
import Article from "../models/Article";

const publishOnQueue = async (queueName: string, msg: string) => {
  const connection = await amqplib.connect(`amqp://${process.env.RABBITMQ_HOSTNAME}`);
  const channel = await connection.createChannel();
  await channel.assertQueue(queueName, { durable: false });
  channel.sendToQueue(queueName, Buffer.from(msg));
  setTimeout(() => {
    connection.close();
  }, 500);
};

const createArticle = (req: Request, res: Response, next: NextFunction) => {
  const { title, body, category } = req.body;

  if (!title || !body || !category) {
    return res
      .status(400)
      .json({ error: true, message: "Invalid data provided" });
  }

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

  if (!mongoose.Types.ObjectId.isValid(articleId ?? "")) {
    return res
      .status(400)
      .json({ error: true, message: "Invalid ID provided" });
  }

  return Article.findById(articleId)
    .then((article) =>
      article
        ? res.status(200).json({ error: false, article })
        : res.status(404).json({ message: "Article not found" })
    )
    .catch((error) => res.status(500).json({ error }));
};

const getAll = (req: Request, res: Response, next: NextFunction) => {
  const category = req.query?.category;
  const query = category ? Article.find({ category }) : Article.find();
  return query
    .then((articles) => res.status(200).json({ error: false, articles }))
    .catch((error) => res.status(500).json({ error }));
};

const getAllTitles = (req: Request, res: Response, next: NextFunction) => {
  return Article.find({})
    .select("_id title category")
    .then((articles) => res.status(200).json({ error: false, articles }))
    .catch((error) => res.status(500).json({ error }));
};

const updateArticle = (req: Request, res: Response, next: NextFunction) => {
  const articleId = req.params.articleId;
  if (!mongoose.Types.ObjectId.isValid(articleId ?? "")) {
    return res
      .status(400)
      .json({ error: true, message: "Invalid ID provided" });
  }

  return Article.findById(articleId)
    .then((article) => {
      if (article) {
        article.set(req.body);

        return article
          .save()
          .then((article) => res.status(200).json({ error: false, article }))
          .catch((error) => res.status(500).json({ error }));
      } else {
        res.status(404).json({ error: true, message: "Article not found" });
      }
    })
    .catch((error) => res.status(500).json({ error }));
};

const deleteArticle = (req: Request, res: Response, next: NextFunction) => {
  const articleId = req.params.articleId;
  if (!mongoose.Types.ObjectId.isValid(articleId ?? "")) {
    return res
      .status(400)
      .json({ error: true, message: "Invalid ID provided" });
  }

  return Article.findByIdAndDelete(articleId)
    .then((article) =>
      article
        ? res.status(200).json({ error: false })
        : res.status(404).json({ message: "Article not found" })
    )
    .catch((error) => res.status(500).json({ error }));
};

const recordView = (req: Request, res: Response, next: NextFunction) => {
  const articleId = req.params.articleId;
  if (!mongoose.Types.ObjectId.isValid(articleId ?? "")) {
    return res
      .status(400)
      .json({ error: true, message: "Invalid ID provided" });
  }

  publishOnQueue("resource_views", JSON.stringify({resourceId: articleId}));
  return res.status(201).json({ error:false });
}

export default {
  createArticle,
  getArticle,
  getAll,
  getAllTitles,
  updateArticle,
  deleteArticle,
  recordView,
};
