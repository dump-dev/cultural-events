import cors from "cors";
import "dotenv/config";
import express from "express";
import "reflect-metadata";
import errorHandlerMiddleware from "./middlewares/error-handler.middleware";
import router from "./router";
import { connectDB } from "./typeorm/data-source";
import seedRolesAndPermissions from "./typeorm/roles-and-permissions.seed";
import { connectRedis, closeConnectionRedis } from "./redis-client/client";

export default async function bootstrap() {
  await Promise.all([connectDB(), connectRedis()]);
  if (process.env.NODE_ENV !== "production") await seedRolesAndPermissions();
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use(router);
  app.use(errorHandlerMiddleware);

  return app;
}
