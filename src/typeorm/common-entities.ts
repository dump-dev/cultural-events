import { DataSourceOptions } from "typeorm";
import CulturalEvent from "./entities/CulturalEvent";
import LikeCulturalEvent from "./entities/LikeCulturalEvent";
import Location from "./entities/Location";
import Organizer from "./entities/Organizer";
import Permission from "./entities/Permission";
import RolePermission from "./entities/RolePermission";
import User from "./entities/User";

export const commonEntities: Required<DataSourceOptions["entities"]> = [
  User,
  Organizer,
  Location,
  CulturalEvent,
  LikeCulturalEvent,
  Permission,
  RolePermission,
];
