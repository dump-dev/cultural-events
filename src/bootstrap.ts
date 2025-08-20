import cors from "cors";
import "dotenv/config";
import express from "express";
import "reflect-metadata";
import errorHandlerMiddleware from "./middlewares/error-handler.middleware";
import router from "./router";
import { connectDB } from "./typeorm/data-source";
import seedRolesAndPermissions from "./typeorm/seed-roles-and-permissions";

export default async function bootstrap() {
  await connectDB();
  if (process.env.NODE_ENV !== 'production')
    await seedRolesAndPermissions()
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use(router);
  app.use(errorHandlerMiddleware);

  return app;
}
