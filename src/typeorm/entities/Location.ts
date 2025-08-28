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
  street: string;

  @Column()
  neighborhood: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column({ type: "int" })
  propertyNumber: number;

  @Column()
  cep: string;

  @CreateDateColumn()
  createatAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => CulturalEvent, (cutural) => cutural.location)
  cuturalEvent: CulturalEvent;
}
