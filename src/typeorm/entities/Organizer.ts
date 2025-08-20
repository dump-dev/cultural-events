import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import User from "./User";
import { OrganizerContacts } from "../../features/organizers/types/OrganizerContact";
import CulturalEvent from "./CulturalEvent";

@Entity()
export default class Organizer {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  displayName: string;

  @Column()
  description: string;

  @OneToOne(() => User, (user) => user.organizer, { cascade: true })
  @JoinColumn()
  user: User;

  @Column("simple-json", { nullable: true })
  contacts: OrganizerContacts | null;

  @OneToMany(() => CulturalEvent, (cutural) => cutural.organizer)
  cuturalEvents: Array<CulturalEvent>;
}
