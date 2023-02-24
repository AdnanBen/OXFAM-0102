import express, { Request, Response, Router } from "express";
import mongoose from "mongoose";
import cors from "cors";
import amqplib from "amqplib";

import { config } from "./config/config";

import controller from "./controllers/IncompleteReport";

const app = express();
const port = config.server.port;

app.use(express.json());

app.use(cors());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World3!");
});

app.listen(port, () => {
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

async function receieve() {
  const queueName = "testqueue";
  const connection = await amqplib.connect("amqp://localhost");
  const channel = await connection.createChannel();
  await channel.assertQueue(queueName, { durable: false });
  console.log("Waiting for messages", queueName);

  channel.consume(
    queueName,
    function (msg: any) {
      console.log("Received %s", msg.content.toString());

      // controller.createIncompleteReport(body)
    },
    {
      noAck: true,
    }
  );
}

receieve();

app.get("/te", (req: Request, res: Response) => {
  res.send("Hello World!");
});
