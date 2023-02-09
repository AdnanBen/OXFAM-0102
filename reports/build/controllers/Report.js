"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Report_1 = __importDefault(require("../models/Report"));
const createReport = (req, res, next) => {
    console.log(req.body);
    const { name, gender, body, category } = req.body;
    const report = new Report_1.default({
        _id: new mongoose_1.default.Types.ObjectId(),
        name,
        gender,
        body,
    });
    return report
        .save()
        .then((report) => res.status(201).json({ report }))
        .catch((error) => res.status(500).json({ error }));
};
const getReport = (req, res, next) => {
    const reportId = req.params.reportId;
    return Report_1.default.findById(reportId)
        .then((report) => report
        ? res.status(200).json({ report })
        : res.status(404).json({ message: "Report not found" }))
        .catch((error) => res.status(500).json({ error }));
};
const getAll = (req, res, next) => {
    return Report_1.default.find()
        .then((reports) => res.status(201).json({ reports }))
        .catch((error) => res.status(500).json({ error }));
};
const deleteReport = (req, res, next) => {
    const reportId = req.params.reportId;
    return Report_1.default.findByIdAndDelete(reportId)
        .then((report) => report
        ? res.status(201).json({ message: "Report Deleted" })
        : res.status(404).json({ message: "Report not found" }))
        .catch((error) => res.status(500).json({ error }));
};
exports.default = {
    createReport,
    getReport,
    getAll,
    deleteReport,
};
