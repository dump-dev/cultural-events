import { Role } from "../@types/Role";
import { PermissionEnum } from "../constants/permission";

import { AppDataSource } from "./data-source";
import Permission from "./entities/Permission";
import RolePermission from "./entities/RolePermission";
import rolePermissions from "./role-permissions";

async function insertPermissions() {
  const permissionRepository = AppDataSource.getRepository(Permission);
  const permissionNames = Object.values(PermissionEnum);

  for (let name of permissionNames) {
    await permissionRepository.save({ name: name });
  }
}

async function insertRolePermissions() {
  const rolePermissionRepository = AppDataSource.getRepository(RolePermission);
  const roleAndPermissions = Object.entries(rolePermissions);

  for (let [role, permissions] of roleAndPermissions) {
    for (let permission of permissions) {
      await rolePermissionRepository.save({
        role_name: role as Role,
        permission_name: permission,
      });
    }
  }
}

export default async function seedRolesAndPermissions() {
  await insertPermissions();
  await insertRolePermissions();
}
