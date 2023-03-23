import express from "express";
import controller from "../controllers/IncompleteReport";

const router = express.Router();

router.get("/getall", controller.getAll);

export default router;
