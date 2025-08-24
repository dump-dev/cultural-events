import cors from "cors";
import "dotenv/config";
import express from "express";
import "reflect-metadata";
import errorHandlerMiddleware from "./middlewares/error-handler.middleware";
import { connectRedis } from "./redis-client/client";
import router from "./router";
import { connectDB } from "./typeorm/data-source";

export default async function bootstrap() {
  await Promise.all([connectDB(), connectRedis()]);
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use(router);
  app.use(errorHandlerMiddleware);

  return app;
}
