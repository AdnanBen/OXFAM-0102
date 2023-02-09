"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const Article_1 = __importDefault(require("../controllers/Article"));
const router = express_1.default.Router();
router.post("/create", Article_1.default.createArticle);
router.get("/get/:articleId", Article_1.default.getArticle);
router.get("/getall", Article_1.default.getAll);
router.get("/getalltitles", Article_1.default.getAllTitles);
router.get("/getbycategory", Article_1.default.getByCategory);
router.patch("/update/:articleId", Article_1.default.updateArticle);
router.delete("/delete/:articleId", Article_1.default.deleteArticle);
module.exports = router;
