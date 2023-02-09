"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const IncompleteReport_1 = __importDefault(require("../models/IncompleteReport"));
const createIncompleteReport = (req, res, next) => {
    console.log(req.body);
    const { reportId, info } = req.body;
    const incompleteReport = new IncompleteReport_1.default({
        _id: new mongoose_1.default.Types.ObjectId(),
        reportId,
        info,
    });
    return incompleteReport
        .save()
        .then((incompleteReport) => res.status(201).json({ incompleteReport }))
        .catch((error) => res.status(500).json({ error }));
};
const getIncompleteReport = (req, res, next) => {
    const incompleteReportId = req.params.incompleteReportId;
    return IncompleteReport_1.default.findById(incompleteReportId)
        .then((incompleteReport) => incompleteReport
        ? res.status(200).json({ incompleteReport })
        : res.status(404).json({ message: "IncompleteReport not found" }))
        .catch((error) => res.status(500).json({ error }));
};
const getAll = (req, res, next) => {
    return IncompleteReport_1.default.find()
        .then((incompleteReports) => res.status(201).json({ incompleteReports }))
        .catch((error) => res.status(500).json({ error }));
};
const deleteIncompleteReport = (req, res, next) => {
    const incompleteReportId = req.params.incompleteReportId;
    return IncompleteReport_1.default.findByIdAndDelete(incompleteReportId)
        .then((incompleteReport) => incompleteReport
        ? res.status(201).json({ message: "IncompleteReport Deleted" })
        : res.status(404).json({ message: "IncompleteReport not found" }))
        .catch((error) => res.status(500).json({ error }));
};
exports.default = {
    createIncompleteReport,
    getIncompleteReport,
    getAll,
    deleteIncompleteReport,
};
