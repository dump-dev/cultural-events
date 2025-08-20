import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Permission, Permissions } from "../../@types/Permission";
import PermissionEntity from "./Permission";
import { Role, Roles } from "../../@types/Role";

@Entity()
export default class RolePermission {
  @PrimaryColumn({ enum: Roles })
  role_name: Role;

  @PrimaryColumn({ enum: Permissions })
  permission_name: Permission;

  @ManyToOne(() => PermissionEntity, { onDelete: "CASCADE" })
  @JoinColumn({ name: "permission_name" })
  permissions: PermissionEntity;
}
