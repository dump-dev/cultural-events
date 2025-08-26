import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import bcrypt from "bcrypt";
import Organizer from "./Organizer";
import LikeCulturalEvent from "./LikeCulturalEvent";
import { Role } from "../../@types/Role";
import { RoleEnum, roles } from "../../constants/role";

@Entity()
export default class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  authEmail: string;

  @Column()
  password: string;

  @Column({ type: "text", enum: roles, default: RoleEnum.USER })
  role: Role;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  async verifyPassword(password: string) {
    return await bcrypt.compare(password, this.password);
  }

  @OneToOne(() => Organizer, (organizer) => organizer.user)
  organizer: Organizer;

  @OneToMany(() => LikeCulturalEvent, (likes) => likes.user, { nullable: true })
  likes: Array<LikeCulturalEvent>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
