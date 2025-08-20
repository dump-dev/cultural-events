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
import { Role, RoleEnum, Roles } from "../../@types/Role";

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

  @Column({ enum: Roles, default: RoleEnum.USER })
  role: Role;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
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
