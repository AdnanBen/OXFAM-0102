"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const IncompleteReport_1 = __importDefault(require("../controllers/IncompleteReport"));
const router = express_1.default.Router();
router.post("/create", IncompleteReport_1.default.createIncompleteReport);
router.get("/get/:IncompleteReportId", IncompleteReport_1.default.getIncompleteReport);
router.get("/getall", IncompleteReport_1.default.getAll);
router.delete("/delete/:IncompleteReportId", IncompleteReport_1.default.deleteIncompleteReport);
module.exports = router;
