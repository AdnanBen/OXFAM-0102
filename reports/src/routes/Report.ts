import express from "express";
import controller from "../controllers/Report";

const router = express.Router();

router.post("/create", controller.createReport);

router.get("/get/:reportId", controller.getReport);
router.get("/getall", controller.getAll);

router.delete("/delete/:reportId", controller.deleteReport);

export default router;
