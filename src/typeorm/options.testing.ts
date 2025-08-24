import { DataSourceOptions } from "typeorm";
import { SeederOptions } from "typeorm-extension";
import { commonEntities } from "./common-entities";
import UserAdmin1756050977754 from "./seeds/1756050977754-UserAdmin";
import Permissions1756052024615 from "./seeds/1756052024615-Permissions";
import RoleAndPermissions1756052031346 from "./seeds/1756052031346-RoleAndPermissions";

const testingOptions: DataSourceOptions & SeederOptions = {
  type: "sqlite",
  database: ":memory:",
  entities: commonEntities,
  synchronize: true,
  seeds: [
    UserAdmin1756050977754,
    Permissions1756052024615,
    RoleAndPermissions1756052031346,
  ],
};

export default testingOptions;
