import { DataSource } from "typeorm";
import { Seeder, SeederFactoryManager } from "typeorm-extension";
import RolePermission from "../entities/RolePermission";
import rolePermissions from "../role-permissions";
import { Role } from "../../@types/Role";

export default class RoleAndPermissions1756052031346 implements Seeder {
  track = false;

  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager
  ): Promise<any> {
    const repository = dataSource.getRepository(RolePermission);
    const roleAndPermissions = Object.entries(rolePermissions);

    for (let [role, permissions] of roleAndPermissions) {
      for (let permission of permissions) {
        await repository.save({
          role_name: role as Role,
          permission_name: permission,
        });
      }
    }
  }
}
