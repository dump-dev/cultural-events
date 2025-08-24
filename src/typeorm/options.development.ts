import { DataSourceOptions } from "typeorm";
import { SeederOptions } from "typeorm-extension";
import { commonEntities } from "./common-entities";

const developmentOptions: DataSourceOptions & SeederOptions = {
  type: "sqlite",
  database: ":memory:",
  entities: commonEntities,
  synchronize: true,
  seeds: ["./src/typeorm/seeds/**/*{.ts,.js}"],
  seedTracking: true,
};

export default developmentOptions;
