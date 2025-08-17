import "reflect-metadata";
import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./typeorm/data-source";

export default async function bootstrap() {
  await connectDB();
  const app = express();
  app.use(cors());
  app.use(express.json());

  return app;
}
