import { OrganizerContacts } from "../types/OrganizerContact";

export type PublicOrganizerDTO = {
  id: string;
  displayName: string;
  description: string;
  contacts?: OrganizerContacts;
};
