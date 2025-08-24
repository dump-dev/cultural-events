import "dotenv/config";
import developmentOptions from "./options.development";
import productionsOptions from "./options.production";
import { DataSourceOptions } from "typeorm";
import testingOptions from "./options.testing";

export default function getEnvironmentOptions(): DataSourceOptions {
  switch (process.env.NODE_ENV) {
    case "production":
      return productionsOptions;
    case "development":
      return developmentOptions;
    case "test":
      return testingOptions;
    default:
      throw new Error(
        `Not found options for environment: ${process.env.NODE_ENV}`
      );
  }
}
