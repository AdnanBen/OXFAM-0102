import * as appInsights from "applicationinsights";
import express, { Request, Response, Router } from "express";
import http from "http";
import mongoose from "mongoose";

import { config } from "./config/config";

import articleRoutes from "./routes/Article";

if (process.env.NODE_ENV === "production") {
  appInsights
    .setup(process.env.APPLICATIONINSIGHTS_CONNECTION_STRING)
    .setAutoDependencyCorrelation(true)
    .setAutoCollectRequests(true)
    .setAutoCollectPerformance(true, true)
    .setAutoCollectExceptions(true)
    .setAutoCollectDependencies(true)
    .setAutoCollectConsole(true, true)
    .setUseDiskRetryCaching(true)
    .setAutoCollectPreAggregatedMetrics(true)
    .setSendLiveMetrics(false)
    .setAutoCollectHeartbeat(false)
    .setAutoCollectIncomingRequestAzureFunctions(true)
    .setInternalLogging(true, true)
    .setDistributedTracingMode(appInsights.DistributedTracingModes.AI_AND_W3C)
    .enableWebInstrumentation(false)
    .start();
}

const app = express();
const port = config.server.port;

if (process.env.NODE_ENV !== "test") {
  app.listen(port, "0.0.0.0", () => {
    return console.log(`Express is listening at http://localhost:${port}`);
  });
}

mongoose
  .connect(config.mongo.url, { retryWrites: true, w: "majority" })
  .then(() => {
    console.log("Connected");
  })
  .catch((err) => {
    console.log(config.mongo.url);
    console.log("Not Connected");
  });

app.use(express.json());
app.use("/", articleRoutes);
export { app };
