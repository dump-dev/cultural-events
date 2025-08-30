import { Role } from "../../../@types/Role";

export type CreateAccessTokenDTO = {
  userId: string;
  firstName: string
  role: Role;
};
