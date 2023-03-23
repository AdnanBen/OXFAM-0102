import express from "express";
import controller from "../controllers/Report";

const router = express.Router();

router.post("/", controller.createReport);

router.get("/:reportId", controller.getReport);
router.get("/", controller.getAll);

router.delete("/:reportId", controller.deleteReport);

export default router;
