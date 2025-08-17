import {
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import Location from "./Location";
import Organizer from "./Organizer";

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
  location: Location;
}
