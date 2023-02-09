import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import IncompleteReport from "../models/IncompleteReport";

const createIncompleteReport = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(req.body);
  const { reportId, info } = req.body;

  const incompleteReport = new IncompleteReport({
    _id: new mongoose.Types.ObjectId(),
    reportId,
    info,
  });

  return incompleteReport
    .save()
    .then((incompleteReport) => res.status(201).json({ incompleteReport }))
    .catch((error) => res.status(500).json({ error }));
};

const getIncompleteReport = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const incompleteReportId = req.params.incompleteReportId;

  return IncompleteReport.findById(incompleteReportId)
    .then((incompleteReport) =>
      incompleteReport
        ? res.status(200).json({ incompleteReport })
        : res.status(404).json({ message: "IncompleteReport not found" })
    )
    .catch((error) => res.status(500).json({ error }));
};

const getAll = (req: Request, res: Response, next: NextFunction) => {
  return IncompleteReport.find()
    .then((incompleteReports) => res.status(201).json({ incompleteReports }))
    .catch((error) => res.status(500).json({ error }));
};

const deleteIncompleteReport = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const incompleteReportId = req.params.incompleteReportId;

  return IncompleteReport.findByIdAndDelete(incompleteReportId)
    .then((incompleteReport) =>
      incompleteReport
        ? res.status(201).json({ message: "IncompleteReport Deleted" })
        : res.status(404).json({ message: "IncompleteReport not found" })
    )
    .catch((error) => res.status(500).json({ error }));
};

export default {
  createIncompleteReport,
  getIncompleteReport,
  getAll,
  deleteIncompleteReport,
};
