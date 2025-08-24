import { DataSource } from "typeorm";
import { Seeder, SeederFactoryManager } from "typeorm-extension";
import { PermissionEnum } from "../../constants/permission";
import Permission from "../entities/Permission";

export default class Permissions1756052024615 implements Seeder {
  track = false;

  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager
  ): Promise<any> {
    const repository = dataSource.getRepository(Permission);
    for (let name of Object.values(PermissionEnum)) {
      await repository.save({ name });
    }
  }
}
