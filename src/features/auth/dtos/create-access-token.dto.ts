import { Role } from "../../../@types/Role";

export type CreateAccessTokenDTO = {
  userId: string;
  role: Role;
};
