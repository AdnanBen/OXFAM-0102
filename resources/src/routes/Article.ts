import express from "express";
import controller from "../controllers/Article";

const router = express.Router();

router.post("/create", controller.createArticle);

router.get("/get/:articleId", controller.getArticle);
router.get("/getall", controller.getAll);

router.get("/getalltitles", controller.getAllTitles);
router.get("/getbycategory", controller.getByCategory);

router.patch("/update/:articleId", controller.updateArticle);
router.delete("/delete/:articleId", controller.deleteArticle);

export = router;
