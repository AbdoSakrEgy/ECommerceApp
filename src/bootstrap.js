import express from "express";
import { DBConnection } from "./DB/db.connection.js";
import dotenv from "dotenv";
import routeRouter from "./route.js";
import cors from "cors";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
const app = express();
dotenv.config({ path: "./src/.env" });
const allowedOrigins = ["google.com", "facebook.com", undefined];

export const bootstrap = async () => {
  await DBConnection();

  app.use(express.json());
  app.use(
    cors({
      origin: function (origin, callback) {
        if (allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
    })
  );
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
      message: "Stop spam requests!",
    })
  );
  app.use(helmet());
  app.use("/api/v1", routeRouter);
  app.use((err, req, res, next) => {
    return res
      .status(500)
      .json({ status: 500, errMsg: err.message, stack: err.stack });
  });
  app.listen(process.env.PORT, () => {
    console.log("Backend server is running");
    console.log("=============================");
  });
};
