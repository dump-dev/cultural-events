import { OrganizerContacts } from "../../organizers/types/OrganizerContact";

export type CulturalEventDetailedDTO = {
  id: string;
  title: string;
  description: string;
  date: string;
  organizer: {
    id: string;
    displayName: string;
    description: string;
    contacts?: OrganizerContacts;
  };
  location: {
    name: string;
    street: string;
    neighborhood: string;
    city: string;
    state: string;
    cep: string;
    propertyNumber: number;
  };
};
