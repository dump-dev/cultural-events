import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import Permission from "./Permission";
import { Role, Roles } from "../../@types/Role";

@Entity()
export default class RolePermission {
  @PrimaryColumn({ enum: Roles })
  role_name: Role;

  @PrimaryColumn()
  permission_name: string;

  @ManyToOne(() => Permission, { onDelete: "CASCADE" })
  @JoinColumn({ name: "permission_name" })
  permissions: Permission;
}
