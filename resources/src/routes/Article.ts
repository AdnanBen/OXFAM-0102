import express from "express";
import controller from "../controllers/Article";

const router = express.Router();

router.get("/resources", controller.getAll);
router.get("/resources/titles", controller.getAllTitles);
router.get("/resources/:articleId", controller.getArticle);

router.post("/moderator/resources", controller.createArticle);

router.patch("/moderator/resources/:articleId", controller.updateArticle);
router.delete("/moderator/resources/:articleId", controller.deleteArticle);

export default router;
