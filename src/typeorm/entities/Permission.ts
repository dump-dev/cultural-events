import {
  Entity,
  PrimaryColumn
} from "typeorm";

@Entity()
export default class Permission {
  @PrimaryColumn()
  name: string;
}
