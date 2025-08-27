import TestAgent from "supertest/lib/agent";
import { OrganizerContacts } from "../../features/organizers/types/OrganizerContact";
import { faker } from "@faker-js/faker";

type Organizer = {
  name: string;
  email: string;
  password: string;
  displayName: string;
  description: string;
  contacts?: OrganizerContacts;
};

type Credentials = {
  email: string;
  password: string;
};

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

export const registerOrganizer = async (
  testAgent: TestAgent,
  organizer: Organizer
) => testAgent.post("/organizers").send(organizer);

export const loginOrganizer = async (
  testAgent: TestAgent,
  credentials: Credentials
) => testAgent.post("/auth/login").send(credentials);

export const createAndLoginOrganizer = async (
  testAgent: TestAgent,
  organizer: Organizer
) => {
  const registerReponse = await registerOrganizer(testAgent, organizer);
  const organizerId = registerReponse.body.id;

  const response = await loginOrganizer(testAgent, organizer);

  return {
    organizerId,
    accessToken: response.body.accessToken,
  };
};
