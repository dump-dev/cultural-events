import { faker } from "@faker-js/faker";
import TestAgent from "supertest/lib/agent";

export const makeFakeCulturalEventData = (organizerId: string) => {
  return {
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    organizerId,
    location: {
      name: faker.location.state(),
      street: faker.location.street(),
      neighborhood: faker.location.county(),
      state: faker.location.state(),
      city: faker.location.city(),
      propertyNumber: parseInt(faker.location.buildingNumber()),
      cep: faker.string.numeric({ length: 8 }),
    },
    date: faker.date.soon({ days: 15 }),
  };
};

type CreateCulturalEvent = {
  testAgent: TestAgent;
  organizer: {
    id: string;
    accessToken: string;
  };
  culturalEvent?: ReturnType<typeof makeFakeCulturalEventData>;
};
export const createCulturalEvent = async ({
  testAgent,
  organizer,
  culturalEvent,
}: CreateCulturalEvent) => {
  culturalEvent = culturalEvent ?? makeFakeCulturalEventData(organizer.id);
  return testAgent
    .post("/cultural-events")
    .set("Authorization", `Bearer ${organizer.accessToken}`)
    .send(culturalEvent);
};
