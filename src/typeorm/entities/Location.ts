import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import CulturalEvent from "./CulturalEvent";

@Entity()
export default class Location {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column()
  country: string;

  @Column({ name: "zip_code" })
  zipCode: string;

  @CreateDateColumn()
  createatAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => CulturalEvent, (cutural) => cutural.location)
  cuturalEvent: CulturalEvent;
}
