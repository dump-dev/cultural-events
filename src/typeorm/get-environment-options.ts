import "dotenv/config";
import developmentOptions from "./options.development";
import productionsOptions from "./options.production";
import { DataSourceOptions } from "typeorm";

export default function getEnvironmentOptions(): DataSourceOptions {
  switch (process.env.NODE_ENV) {
    case "production":
      return productionsOptions;
    case "development":
      return developmentOptions;
    default:
      throw new Error(
        `Not found options for environment: ${process.env.NODE_ENV}`
      );
  }
}
