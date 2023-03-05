import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import Report from "../models/Report";

const createReport = (req: Request, res: Response, next: NextFunction) => {
  const { name, gender, body, category } = req.body;

  if (!name || !gender || !body) {
    return res
      .status(400)
      .json({ error: true, message: "Invalid data provided" });
  }

  const report = new Report({
    _id: new mongoose.Types.ObjectId(),
    name,
    gender,
    body,
  });

  return report
    .save()
    .then((report) => res.status(201).json({ error: false, report }))
    .catch((error) => res.status(500).json({ error }));
};

const getReport = (req: Request, res: Response, next: NextFunction) => {
  const reportId = req.params.reportId;
  if (!mongoose.Types.ObjectId.isValid(reportId)) {
    return res
      .status(400)
      .json({ error: true, message: "Invalid ID provided" });
  }

  return Report.findById(reportId)
    .then((report) =>
      report
        ? res.status(200).json({ error: false, report })
        : res.status(404).json({ error: true, message: "Report not found" })
    )
    .catch((error) => res.status(500).json({ error }));
};

const getAll = (req: Request, res: Response, next: NextFunction) => {
  return Report.find()
    .then((reports) => res.status(200).json({ error: false, reports }))
    .catch((error) => res.status(500).json({ error }));
};

const deleteReport = (req: Request, res: Response, next: NextFunction) => {
  const reportId = req.params.reportId;
  if (!mongoose.Types.ObjectId.isValid(reportId)) {
    return res
      .status(400)
      .json({ error: true, message: "Invalid ID provided" });
  }

  return Report.findByIdAndDelete(reportId)
    .then((report) =>
      report
        ? res.status(200).json({ error: false, message: "Report Deleted" })
        : res.status(404).json({ error: true, message: "Report not found" })
    )
    .catch((error) => res.status(500).json({ error }));
};

export default {
  createReport,
  getReport,
  getAll,
  deleteReport,
};
