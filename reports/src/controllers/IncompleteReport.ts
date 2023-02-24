import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import amqplib from "amqplib";

const sendMsg = async (msg: string) => {
  const queueName = "testqueue";
  const connection = await amqplib.connect("amqp://localhost");
  const channel = await connection.createChannel();
  await channel.assertQueue(queueName, { durable: false });
  channel.sendToQueue(queueName, Buffer.from(msg));
  console.log("sent test");
  setTimeout(() => {
    connection.close();
  }, 500);
};

const createIncompleteReport = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("test");
  // console.log(req.body);
  // const { reportId, info } = req.body;

  // const incompleteReport = new IncompleteReport({
  //   _id: new mongoose.Types.ObjectId(),
  //   reportId,
  //   info,
  // });

  console.log("also here");
  sendMsg(JSON.stringify(req.body));
  return res.status(201).json({ Created: "Success" });

  // return incompleteReport
  //   .save()
  //   .then((incompleteReport) => res.status(201).json({ incompleteReport }))
  //   .catch((error) => res.status(500).json({ error }));
};

export default {
  createIncompleteReport,
};
