import { DataSource } from "typeorm";
import { DataSourceOptions } from "typeorm";
import path from "path";
import User from "./entities/User";

const entities: Required<DataSourceOptions["entities"]> = [User];

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
};

const AppDataSource = new DataSource(
  process.env.NODE_ENV === "production"
    ? productionsOptions
    : developmentOptions
);

let dataSource: DataSource | null = null;

export async function connectDB() {
  dataSource = await AppDataSource.initialize();
  console.log("✅ initialized database connection");
}

export async function closeConnectionDB() {
  await dataSource?.destroy();
  console.log("📴 closed database connection");
}
