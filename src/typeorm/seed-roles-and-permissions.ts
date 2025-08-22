import { Role } from "../@types/Role";
import { PermissionEnum } from "../constants/permission";
import { RoleEnum } from "../constants/role";
import { AppDataSource } from "./data-source";
import Permission from "./entities/Permission";
import RolePermission from "./entities/RolePermission";

const rolePermissions = {
  [RoleEnum.USER]: [
    PermissionEnum.USER_DETAILS,
    PermissionEnum.USER_CREATE,
    PermissionEnum.USER_UPDATE,
    PermissionEnum.USER_DELETE,

    PermissionEnum.LIKE_DETAILS,
    PermissionEnum.LIKE_CULTURAL_EVENT,
    PermissionEnum.UNLIKE_CULTURAL_EVENT,

    PermissionEnum.ORGANIZER_LIST,
    PermissionEnum.CULTURAL_EVENT_LIST,
  ],

  [RoleEnum.ORGANIZER]: [
    PermissionEnum.ORGANIZER_LIST,
    PermissionEnum.ORGANIZER_CREATE,
    PermissionEnum.ORGANIZER_UPDATE,
    PermissionEnum.ORGANIZER_DELETE,

    PermissionEnum.CULTURAL_EVENT_LIST,
    PermissionEnum.CULTURAL_EVENT_CREATE,
    PermissionEnum.CULTURAL_EVENT_UPDATE,
    PermissionEnum.CULTURAL_EVENT_DELETE,
  ],

  [RoleEnum.ADMIN]: [
    PermissionEnum.USER_LIST,
    PermissionEnum.USER_DETAILS,

    PermissionEnum.USER_DELETE,

    PermissionEnum.ORGANIZER_LIST,
    PermissionEnum.ORGANIZER_DELETE,

    PermissionEnum.CULTURAL_EVENT_LIST,
    PermissionEnum.CULTURAL_EVENT_DELETE,
  ],
};

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
