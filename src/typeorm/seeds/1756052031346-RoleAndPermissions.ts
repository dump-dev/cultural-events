import { DataSource } from "typeorm";
import { Seeder } from "typeorm-extension";
import { Role } from "../../@types/Role";
import RolePermission from "../entities/RolePermission";
import rolePermissions from "../role-permissions";

export default class RoleAndPermissions1756052031346 implements Seeder {
  track = false;

  public async run(
    dataSource: DataSource,
  ): Promise<void> {
    const repository = dataSource.getRepository(RolePermission);
    const roleAndPermissions = Object.entries(rolePermissions);

    for (const [role, permissions] of roleAndPermissions) {
      for (const permission of permissions) {
        await repository.save({
          role_name: role as Role,
          permission_name: permission,
        });
      }
    }
  }
}
