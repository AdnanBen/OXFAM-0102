import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import ResourceView from "../models/ResourceView";

const createResourceView = (body: string) => {
  const bodyObj = JSON.parse(body);

  const { resourceId } = bodyObj;

  const resourceView = new ResourceView({
    _id: new mongoose.Types.ObjectId(),
    resourceId,
  });

  return resourceView.save();
};

const getAll = (req: Request, res: Response, next: NextFunction) => {
  return ResourceView.find()
    .then((resourceViews) => res.status(201).json({ resourceViews }))
    .catch((error) => res.status(500).json({ error }));
};

export default {
  createResourceView,
  getAll,
};
