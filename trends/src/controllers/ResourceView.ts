import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import ResourceView from "../models/ResourceView";

const createResourceView = (body: string) => {
  const bodyObj = JSON.parse(body);

  const { resourceId, timestamp } = bodyObj;

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

const incrementCount = (
  data: { [key: string]: number },
  resourceId: string
) => {
  if (!data[resourceId]) {
    data[resourceId] = 0;
  }
  data[resourceId] += 1;
};

const getTrends = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const allTimeTrends = await ResourceView.find();
    const weeklyTrends = await ResourceView.find({
      timestamp: { $gte: oneWeekAgo },
    });
    const dailyTrends = await ResourceView.find({
      timestamp: { $gte: oneDayAgo },
    });

    const allTimeData: { [key: string]: number } = {};
    const weeklyData: { [key: string]: number } = {};
    const dailyData: { [key: string]: number } = {};

    allTimeTrends.forEach((element) => {
      incrementCount(allTimeData, element.resourceId);
    });

    weeklyTrends.forEach((element) => {
      incrementCount(weeklyData, element.resourceId);
    });

    dailyTrends.forEach((element) => {
      incrementCount(dailyData, element.resourceId);
    });

    return res.status(201).json({
      allTime: allTimeData,
      weekly: weeklyData,
      daily: dailyData,
    });
  } catch (error) {
    console.log(error);
  }
};

export default {
  createResourceView,
  getTrends,
};
