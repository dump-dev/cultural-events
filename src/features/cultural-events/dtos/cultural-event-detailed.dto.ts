import { OrganizerContacts } from "../../organizers/types/OrganizerContact";

export type CulturalEventDetailedDTO = {
  id: string;
  title: string;
  description: string;
  date: string;
  organizer: {
    id: string;
    displayName: string;
    deescription: string;
    contacts?: OrganizerContacts;
  };
  location: {
    name: string;
    address: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
};
