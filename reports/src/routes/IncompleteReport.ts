import express from "express";
import controller from "../controllers/IncompleteReport";

const router = express.Router();

router.post("/create", controller.createIncompleteReport);

router.get("/get/:IncompleteReportId", controller.getIncompleteReport);
router.get("/getall", controller.getAll);

router.delete("/delete/:IncompleteReportId", controller.deleteIncompleteReport);

export = router;
