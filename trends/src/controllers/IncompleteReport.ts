import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import IncompleteReport from "../models/IncompleteReport";

const createIncompleteReport = (body: string) => {
  const bodyObj = JSON.parse(body);

  const { reportId, info } = bodyObj;

  const incompleteReport = new IncompleteReport({
    _id: new mongoose.Types.ObjectId(),
    reportId,
    info,
  });

  return incompleteReport.save();
};

const getAll = (req: Request, res: Response, next: NextFunction) => {
  return IncompleteReport.find()
    .then((incompleteReports) => res.status(200).json({ incompleteReports }))
    .catch((error) => res.status(500).json({ error }));
};

export default {
  createIncompleteReport,
  getAll,
};
