import express from "express";
import controller from "../controllers/IncompleteReport";

const router = express.Router();

router.post("/getall", controller.createIncompleteReport);
export default router;
