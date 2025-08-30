import { UserDTO } from "../../users/dtos/user.dto";
import { OrganizerContacts } from "../types/OrganizerContact";

type OrganizerDetailedDTO<TUser> = {
  id: string;
  displayName: string;
  description: string;
  user: TUser;
  contacts?: OrganizerContacts;
};

export type OrganizerDetailedWithoutRoleDTO = OrganizerDetailedDTO<
  Omit<UserDTO, "role">
>;

export type OrganizerDetailedWithRoleDTO = OrganizerDetailedDTO<UserDTO>;
