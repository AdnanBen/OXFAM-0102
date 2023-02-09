"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const Report_1 = __importDefault(require("../controllers/Report"));
const router = express_1.default.Router();
router.post("/create", Report_1.default.createReport);
router.get("/get/:reportId", Report_1.default.getReport);
router.get("/getall", Report_1.default.getAll);
router.delete("/delete/:ReportId", Report_1.default.deleteReport);
module.exports = router;
