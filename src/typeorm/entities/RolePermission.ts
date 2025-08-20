import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Permission } from "../../@types/Permission";
import PermissionEntity from "./Permission";
import { Role } from "../../@types/Role";
import { permissions } from "../../constants/permission";
import { roles } from "../../constants/role";

@Entity()
export default class RolePermission {
  @PrimaryColumn({ enum: roles })
  role_name: Role;

  @PrimaryColumn({ enum: permissions })
  permission_name: Permission;

  @ManyToOne(() => PermissionEntity, { onDelete: "CASCADE" })
  @JoinColumn({ name: "permission_name" })
  permissions: PermissionEntity;
}
