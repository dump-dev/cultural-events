import { Role } from "../../../@types/Role";

export type AccessPayload = {
  firstName: string;
  role: Role;
  iat: number;
  exp: number;
  iss: string;
};
