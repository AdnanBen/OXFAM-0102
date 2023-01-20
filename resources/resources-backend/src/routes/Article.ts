import express from "express";
import controller from "../controllers/Article";

const router = express.Router();

router.post("/create", controller.createArticle);
router.get("/getall", controller.getAll);

export = router;
