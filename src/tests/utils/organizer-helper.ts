import { OrganizerContacts } from "../../features/organizers/types/OrganizerContact";
import { faker } from "@faker-js/faker";

export const makeFakeOrganizerData = (contacts?: OrganizerContacts) => {
  return {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    displayName: faker.company.name(),
    description: faker.company.buzzPhrase(),
    contacts,
  };
};

export const makeFakeContactsFull: () => Required<OrganizerContacts> = () => ({
  email: faker.internet.email(),
  website: faker.internet.url(),
  instagram: faker.person.firstName(),
  phoneNumber: [faker.phone.number()],
});