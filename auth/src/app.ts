import express from "express";
import mongoose from "mongoose";
import controllers from "./controllers/PendingRegistration";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(express.json());

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});

mongoose
  .connect(process.env.MONGO_URL!, { retryWrites: true, w: "majority" })
  .then(() => {
    console.log("Connected");
  })
  .catch((err) => {
    console.log(process.env.MONGO_URL!);
    console.log("Not Connected", err);
  });

app.post("/pendingRegistrations", controllers.createPendingRegistration);
app.post(
  "/pendingRegistrations/approve/:token",
  controllers.acceptPendingRegistration
);

export { app };
