import "reflect-metadata";
import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./typeorm/data-source";
import router from "./router";
import errorHandlerMiddleware from "./middlewares/error-handler.middleware";

export default async function bootstrap() {
  await connectDB();
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use(router);
  app.use(errorHandlerMiddleware);

  return app;
}
