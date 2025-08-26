import { UserDTO } from "../../users/dtos/user.dto";
import { OrganizerContacts } from "../types/OrganizerContact";

export type OrganizerDetailedDTO = {
    id: string
    displayName: string;
    description: string;
    user: UserDTO
    contacts?: OrganizerContacts
};