import { Role } from "../../../@types/Role";

export type UserDTO = {
  id: string;
  name: string;
  authEmail: string;
  role: Role;
};
