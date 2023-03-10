import express, { Request, Response, Router } from "express";
import mongoose from "mongoose";
import cors from "cors";
import amqplib from "amqplib";

import { config } from "./config/config";

import incompleteReportController from "./controllers/IncompleteReport";

const app = express();
const port = 3010;

app.use(express.json());
app.use(cors());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(config.mongo.url);
  return console.log(`Express is listening at http://localhost:${port}`);
});

mongoose
  .connect(config.mongo.url, { retryWrites: true, w: "majority" })
  .then(() => {
    console.log("Connected");
  })
  .catch((err: any) => {
    console.log(config.mongo.url);
    console.log("Not Connected", err);
  });

app.use(express.json());

function consumeIncompleteReportData(msg: any) {
  console.log("Received %s", msg.content);
  incompleteReportController.createIncompleteReport(msg.content);
}

async function listen() {
  const conn = await amqplib.connect("amqp://localhost");
  const channel = await conn.createChannel();

  // Declare the queues you want to consume from
  await channel.assertQueue("incomplete_reports", { durable: false });
  // await channel.assertQueue("my_queue_2", { durable: false });

  console.log("Waiting for messages...");

  // Start consuming messages from the queues
  await channel.consume(
    "incomplete_reports",
    consumeIncompleteReportData.bind({ channel })
  );
  // await channel.consume(
  //   "queue_2",
  //   handlerfunction.bind({ channel })
  // );

  console.log("ever get here?");

  // Keep the event loop running by setting a timeout
}

listen().catch(console.error);
