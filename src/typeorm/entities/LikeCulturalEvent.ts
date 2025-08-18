import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import User from "./User";
import CulturalEvent from "./CulturalEvent";

@Entity()
export default class LikeCulturalEvent {
  @PrimaryColumn("uuid")
  user_id: string;

  @PrimaryColumn("uuid")
  cultural_event_id: string;

  @ManyToOne(() => User, (user) => user.likes, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user: User;

  @ManyToOne(() => CulturalEvent, (culturalEvent) => culturalEvent.likes, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "cultural_event_id" })
  culturalEvent: CulturalEvent;
}
