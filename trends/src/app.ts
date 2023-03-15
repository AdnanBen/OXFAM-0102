import express, { Request, Response, Router } from "express";
import mongoose from "mongoose";
import cors from "cors";
import amqplib from "amqplib";

import { config } from "./config/config";

import incompleteReportController from "./controllers/IncompleteReport";
import incompleteReportRoutes from "./routes/IncompleteReport";

const app = express();
const port = config.server.port;

app.use(express.json());
app.use(cors());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
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

// app.use("/trends/incompletereports", incompleteReportRoutes);

// Temp fake endpoints

app.get("/incompletereports", (req, res) => {
  const data = [
    {
      report_id: "1",
      // questionid : filled in
      report_data: [{ 1: 1 }, { 2: 0 }, { 3: 0 }],
    },

    {
      report_id: "2",
      report_data: [{ 1: 1 }, { 2: 1 }, { 3: 0 }],
    },

    {
      report_id: "3",
      report_data: [{ 1: 1 }, { 2: 0 }, { 3: 0 }],
    },

    {
      report_id: "4",
      report_data: [{ 1: 1 }, { 2: 0 }, { 3: 1 }],
    },

    {
      report_id: "5",
      report_data: [{ 1: 0 }, { 2: 1 }, { 3: 1 }],
    },

    {
      report_id: "6",
      report_data: [{ 1: 0 }, { 2: 1 }, { 3: 0 }],
    },
  ];
  res.json(data);
});

app.get("/popularresources", (req, res) => {
  const data = [
    {
      resource_id: "1",
      views_in_last_week: "100",
      views_in_last_month: "400",
      views_all_time: "2000",
    },

    {
      resource_id: "2",
      views_in_last_week: "300",
      views_in_last_month: "500",
      views_all_time: "3000",
    },

    {
      resource_id: "3",
      views_in_last_week: "200",
      views_in_last_month: "700",
      views_all_time: "4000",
    },

    {
      resource_id: "4",
      views_in_last_week: "400",
      views_in_last_month: "600",
      views_all_time: "5000",
    },
  ];
  res.json(data);
});

app.get("/reportkeywords", (req, res) => {
  const data = [
    {
      word: "exampleword0",
      frequency: "1611",
    },

    {
      word: "exampleword1",
      frequency: "2334",
    },

    {
      word: "exampleword2",
      frequency: "5",
    },

    {
      word: "exampleword3",
      frequency: "40210",
    },

    {
      word: "exampleword4",
      frequency: "2020",
    },

    {
      word: "exampleword5",
      frequency: "3",
    },
  ];
  res.json(data);
});

app.listen(port, "0.0.0.0", () => {
  console.log(config.mongo.url);
  return console.log(`Express is listening at http://localhost:${port}`);
});

listen().catch(console.error);
