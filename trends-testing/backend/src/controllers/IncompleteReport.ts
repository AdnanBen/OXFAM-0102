import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import IncompleteReport from "../models/IncompleteReport";

const createIncompleteReport = (body: string) => {
  const bodyObj = JSON.parse(body);

  console.log(body);
  const { reportId, info } = bodyObj;

  const incompleteReport = new IncompleteReport({
    _id: new mongoose.Types.ObjectId(),
    reportId,
    info,
  });

  return incompleteReport.save();
};

export default {
  createIncompleteReport,
};
