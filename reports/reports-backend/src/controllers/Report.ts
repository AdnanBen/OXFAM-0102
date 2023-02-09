import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import Report from "../models/Report";

const createReport = (req: Request, res: Response, next: NextFunction) => {
  console.log(req.body);
  const { name, gender, body, category } = req.body;

  const report = new Report({
    _id: new mongoose.Types.ObjectId(),
    name,
    gender,
    body,
  });

  return report
    .save()
    .then((report) => res.status(201).json({ report }))
    .catch((error) => res.status(500).json({ error }));
};

const getReport = (req: Request, res: Response, next: NextFunction) => {
  const reportId = req.params.reportId;

  return Report.findById(reportId)
    .then((report) =>
      report
        ? res.status(200).json({ report })
        : res.status(404).json({ message: "Report not found" })
    )
    .catch((error) => res.status(500).json({ error }));
};

const getAll = (req: Request, res: Response, next: NextFunction) => {
  return Report.find()
    .then((reports) => res.status(201).json({ reports }))
    .catch((error) => res.status(500).json({ error }));
};

const deleteReport = (req: Request, res: Response, next: NextFunction) => {
  const reportId = req.params.reportId;

  return Report.findByIdAndDelete(reportId)
    .then((report) =>
      report
        ? res.status(201).json({ message: "Report Deleted" })
        : res.status(404).json({ message: "Report not found" })
    )
    .catch((error) => res.status(500).json({ error }));
};

export default {
  createReport,
  getReport,
  getAll,
  deleteReport,
};
