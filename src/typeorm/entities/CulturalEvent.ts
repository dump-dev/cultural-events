import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import Location from "./Location";
import Organizer from "./Organizer";
import LikeCulturalEvent from "./LikeCulturalEvent";

@Entity()
export default class CulturalEvent {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  date: Date;

  @ManyToOne(() => Organizer, (organizer) => organizer.cuturalEvents)
  organizer: Organizer;

  @OneToOne(() => Location, (location) => location.cuturalEvent, {
    cascade: true,
  })
  @JoinColumn()
  location: Location;

  @OneToMany(() => LikeCulturalEvent, likes => likes.culturalEvent, {
    nullable: true
  })
  likes: Array<LikeCulturalEvent>
}
