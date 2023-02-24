import express from "express";
import controller from "../controllers/IncompleteReport";

const router = express.Router();

router.post("/create", controller.createIncompleteReport);

export = router;
