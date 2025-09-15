import express from "express";
import { DBConnection } from "./DB/db.connection";
import dotenv from "dotenv";
import routeRouter from "./route.js";
const app = express();
dotenv.config({ path: "/src/.env" });

export const bootstrap = async () => {
  await DBConnection();

  app.use("api/v1", routeRouter);
  app.use(express.json());
  app.use((err, req, res, next) => {
    return res
      .status(500)
      .json({ status: err.status, errMsg: err.message, stack: err.stack });
  });
  app.listen(process.env.PORT, () => {
    console.log("Backend server is running");
    console.log("=============================");
  });
};
