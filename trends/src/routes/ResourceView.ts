import express from "express";
import controller from "../controllers/ResourceView";

const router = express.Router();

router.post("/", controller.createResourceView);
router.get("/", controller.getTrends);
export default router;
