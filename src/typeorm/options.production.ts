import { DataSourceOptions } from "typeorm";
import { SeederOptions } from "typeorm-extension";
import { commonEntities } from "./common-entities";

const productionsOptions: DataSourceOptions & SeederOptions = {
  type: "sqlite",
  database: "./dist/typeorm/database.sql",
  entities: commonEntities,
  synchronize: false,
  migrations: ["./src/typeorm/migrations/*.{ts,js}"],
  seeds: ["./src/typeorm/seeds/**/*{.ts,.js}"],
};

export default productionsOptions;
