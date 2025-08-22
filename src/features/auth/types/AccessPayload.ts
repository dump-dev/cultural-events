import { Role } from "../../../@types/Role";

export type AccessPayload = {
  role: Role;
  iat: number;
  exp: number;
  iss: string;
};
