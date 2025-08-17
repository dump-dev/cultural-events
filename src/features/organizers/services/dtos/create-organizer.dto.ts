import { OrganizerContacts } from "../../../../@types/OrganizerContact";

export type CreateOrganizersDTO = {
  name: string;
  email: string;
  password: string;
  displayName: string;
  description: string;
  contacts?: OrganizerContacts
};
