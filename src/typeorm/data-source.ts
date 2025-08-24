import path from "path";
import { DataSource, DataSourceOptions } from "typeorm";
import CulturalEvent from "./entities/CulturalEvent";
import LikeCulturalEvent from "./entities/LikeCulturalEvent";
import Location from "./entities/Location";
import Organizer from "./entities/Organizer";
import Permission from "./entities/Permission";
import RolePermission from "./entities/RolePermission";
import User from "./entities/User";
import 'dotenv/config'

const entities: Required<DataSourceOptions["entities"]> = [
  User,
  Organizer,
  Location,
  CulturalEvent,
  LikeCulturalEvent,
  Permission,
  RolePermission,
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
  synchronize: false,
  migrations: [path.resolve(__dirname, "migrations/*.{ts,js}")],
};

const dataSource = new DataSource(
  process.env.NODE_ENV === "production"
    ? productionsOptions
    : developmentOptions
);

export async function connectDB() {
  await dataSource.initialize();
  console.log("✅ initialized database connection");
}

export async function closeConnectionDB() {
  await dataSource.destroy();
  console.log("📴 closed database connection");
}

export default dataSource;
