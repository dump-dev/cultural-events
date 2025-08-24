import { DataSource } from "typeorm";

import getEnvironmentOptions from "./get-environment-options";

const dataSource = new DataSource(getEnvironmentOptions());

export async function connectDB() {
  await dataSource.initialize();
  console.log("✅ initialized database connection");
}

export async function closeConnectionDB() {
  await dataSource.destroy();
  console.log("📴 closed database connection");
}

export default dataSource;
