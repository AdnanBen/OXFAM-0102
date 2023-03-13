import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import amqplib from "amqplib";

const publishOnQueue = async (queueName: string, msg: string) => {
  const connection = await amqplib.connect(`amqp://${process.env.RABBITMQ_HOSTNAME}`);
  const channel = await connection.createChannel();
  await channel.assertQueue(queueName, { durable: false });
  channel.sendToQueue(queueName, Buffer.from(msg));
  setTimeout(() => {
    connection.close();
  }, 500);
};

const createIncompleteReport = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("publishing");
  publishOnQueue("incomplete_reports", JSON.stringify(req.body));
  return res.status(201).json({ Created: "Success" });

  // return incompleteReport
  //   .save()
  //   .then((incompleteReport) => res.status(201).json({ incompleteReport }))
  //   .catch((error) => res.status(500).json({ error }));
};

export default {
  createIncompleteReport,
};
