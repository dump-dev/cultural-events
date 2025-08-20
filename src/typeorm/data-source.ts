import path from "path";
import { DataSource, DataSourceOptions } from "typeorm";
import CulturalEvent from "./entities/CulturalEvent";
import LikeCulturalEvent from "./entities/LikeCulturalEvent";
import Location from "./entities/Location";
import Organizer from "./entities/Organizer";
import Permission from "./entities/Permission";
import RolePermission from "./entities/RolePermission";
import User from "./entities/User";

const entities: Required<DataSourceOptions["entities"]> = [
  User,
  Organizer,
  Location,
  CulturalEvent,
  LikeCulturalEvent,
  Permission,
  RolePermission
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
