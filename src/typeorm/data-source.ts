import { DataSource } from "typeorm";

import getEnvironmentOptions from "./get-environment-options";
import { runSeeders } from "typeorm-extension";

const dataSource = new DataSource(getEnvironmentOptions());

export async function connectDB() {
  await dataSource.initialize();
  console.log("✅ initialized database connection");
  if (process.env.DEV_ENV !== "test") {
    await runSeeders(dataSource);
  }
}

export async function closeConnectionDB() {
  await dataSource.destroy();
  console.log("📴 closed database connection");
}

export default dataSource;
