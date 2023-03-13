import express from "express";
import controller from "../controllers/Article";

const router = express.Router();

router.get("/", controller.getAll);
router.get("/titles", controller.getAllTitles);
router.get("/:articleId", controller.getArticle);

router.post("/", controller.createArticle);

router.patch("/moderator/:articleId", controller.updateArticle);
router.delete("/moderator/:articleId", controller.deleteArticle);

export default router;
