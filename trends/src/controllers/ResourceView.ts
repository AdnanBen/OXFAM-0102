import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import ResourceView from "../models/ResourceView";

const createResourceView = (body: string) => {
  const bodyObj = JSON.parse(body);

  const { resourceId, timestamp } = bodyObj;

  const resourceView = new ResourceView({
    _id: new mongoose.Types.ObjectId(),
    resourceId,
    timestamp: new Date(timestamp),
  });

  return resourceView.save();
};

const getAll = (req: Request, res: Response, next: NextFunction) => {
  return ResourceView.find()
    .then((resourceViews) => res.status(201).json({ resourceViews }))
    .catch((error) => res.status(500).json({ error }));
};

const getResourceViews = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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

    const dataMap: { [resourceId: string]: { [key: string]: number } } = {};

    const incrementCount = (
      data: { [resourceId: string]: { [key: string]: number } },
      resourceId: string,
      key: string
    ) => {
      if (!data[resourceId]) {
        data[resourceId] = {
          views_in_last_day: 0,
          views_in_last_week: 0,
          views_all_time: 0,
        };
      }
      data[resourceId][key] += 1;
    };

    allTimeTrends.forEach((element) => {
      incrementCount(dataMap, element.resourceId, "views_all_time");
    });

    weeklyTrends.forEach((element) => {
      incrementCount(dataMap, element.resourceId, "views_in_last_week");
    });

    dailyTrends.forEach((element) => {
      incrementCount(dataMap, element.resourceId, "views_in_last_day");
    });
    const data = Object.entries(dataMap).map(([resource_id, views]) => ({
      resource_id,
      views_in_last_day: views.views_in_last_day,
      views_in_last_week: views.views_in_last_week,
      views_all_time: views.views_all_time,
    }));

    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
  }
};

export default {
  createResourceView,
  getResourceViews,
};
