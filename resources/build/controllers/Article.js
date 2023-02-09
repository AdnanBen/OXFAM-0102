"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Article_1 = __importDefault(require("../models/Article"));
const createArticle = (req, res, next) => {
    console.log(req.body);
    const { title, body, category } = req.body;
    const article = new Article_1.default({
        _id: new mongoose_1.default.Types.ObjectId(),
        title,
        body,
        category,
    });
    return article
        .save()
        .then((article) => res.status(201).json({ article }))
        .catch((error) => res.status(500).json({ error }));
};
const getArticle = (req, res, next) => {
    const articleId = req.params.articleId;
    return Article_1.default.findById(articleId)
        .then((article) => article
        ? res.status(200).json({ article })
        : res.status(404).json({ message: "Article not found" }))
        .catch((error) => res.status(500).json({ error }));
};
const getAll = (req, res, next) => {
    return Article_1.default.find()
        .then((articles) => res.status(201).json({ articles }))
        .catch((error) => res.status(500).json({ error }));
};
const getAllTitles = (req, res, next) => {
    return Article_1.default.find({}).select("_id, title, category")
        .then((articles) => res.status(201).json({ articles }))
        .catch((error) => res.status(500).json({ error }));
};
const getByCategory = (req, res, next) => {
    var _a;
    console.log(req.query);
    const categoryParam = (_a = req.query) === null || _a === void 0 ? void 0 : _a.category;
    return Article_1.default.find({ category: categoryParam })
        .then((articles) => res.status(201).json({ articles }))
        .catch((error) => res.status(500).json({ error }));
};
const updateArticle = (req, res, next) => {
    const articleId = req.params.articleId;
    return Article_1.default.findById(articleId)
        .then((article) => {
        if (article) {
            article.set(req.body);
            return article
                .save()
                .then((article) => res.status(201).json({ article }))
                .catch((error) => res.status(500).json({ error }));
        }
        else {
            res.status(404).json({ message: "Article not found" });
        }
    })
        .catch((error) => res.status(500).json({ error }));
};
const deleteArticle = (req, res, next) => {
    const articleId = req.params.articleId;
    return Article_1.default.findByIdAndDelete(articleId)
        .then((article) => article
        ? res.status(201).json({ message: "Article Deleted" })
        : res.status(404).json({ message: "Article not found" }))
        .catch((error) => res.status(500).json({ error }));
};
exports.default = {
    createArticle,
    getArticle,
    getAll,
    getAllTitles,
    getByCategory,
    updateArticle,
    deleteArticle,
};
