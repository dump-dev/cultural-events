import { DataSource } from "typeorm";
import { Seeder } from "typeorm-extension";
import { PermissionEnum } from "../../constants/permission";
import Permission from "../entities/Permission";

export default class Permissions1756052024615 implements Seeder {
  track = false;

  public async run(
    dataSource: DataSource
  ): Promise<void> {
    const repository = dataSource.getRepository(Permission);
    for (const name of Object.values(PermissionEnum)) {
      await repository.save({ name });
    }
  }
}
