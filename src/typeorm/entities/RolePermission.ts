import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import Permission from "./Permission";

@Entity()
export default class RolePermission {
  @PrimaryColumn()
  role_name: string;

  @PrimaryColumn()
  permission_name: string;

  @ManyToOne(() => Permission, { onDelete: "CASCADE" })
  @JoinColumn({ name: "permission_name" })
  permissions: Permission;
}
