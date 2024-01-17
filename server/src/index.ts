import express, { Express } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import "dotenv/config";
import connectToDatabase from "./database";
import taskRoutes from "./routes/task";
import authRoutes from "./routes/auth";
import { cronJob } from "./services/cron";

const app: Express = express();
connectToDatabase();

app.use(bodyParser.json({ limit: "30mb" }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

cronJob(); //TO RUN ALL THE PENDING OR ONGOING TASKS.

app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}!`)
);
