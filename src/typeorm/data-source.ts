import { DataSource } from "typeorm";
import { DataSourceOptions } from "typeorm";
import path from "path";
import User from "./entities/User";
import Organizer from "./entities/Organizer";
import Location from "./entities/Location";
import CulturalEvent from "./entities/CulturalEvent";

const entities: Required<DataSourceOptions["entities"]> = [
  User,
  Organizer,
  Location,
  CulturalEvent,
];

const developmentOptions: DataSourceOptions = {
  type: "sqlite",
  database: ":memory:",
  entities,
  synchronize: true,
};

const productionsOptions: DataSourceOptions = {
  type: "sqlite",
  database: path.resolve(__dirname, "database.sql"),
  entities: entities,
  synchronize: true
};

export const AppDataSource = new DataSource(
  process.env.NODE_ENV === "production"
    ? productionsOptions
    : developmentOptions
);

export async function connectDB() {
  await AppDataSource.initialize();
  console.log("✅ initialized database connection");
}

export async function closeConnectionDB() {
  await AppDataSource.destroy();
  console.log("📴 closed database connection");
}
