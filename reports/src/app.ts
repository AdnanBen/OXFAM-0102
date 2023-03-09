import express, { Request, Response, Router } from "express";
import mongoose from "mongoose";
import cors from "cors";

import { config } from "./config/config";

import reportRoutes from "./routes/Report";
import incompleteReportRoutes from "./routes/IncompleteReport";

const app = express();
const port = 3config.server.port;

app.use(express.json());

app.use(cors());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});

mongoose
  .connect(config.mongo.url, { retryWrites: true, w: "majority" })
  .then(() => {
    console.log("Connected");
  })
  .catch((err) => {
    console.log(config.mongo.url);
    console.log("Not Connected", err);
  });

app.use(express.json());

app.use("/reports/completereports", reportRoutes);
app.use("/reports/incompletereports", incompleteReportRoutes);
