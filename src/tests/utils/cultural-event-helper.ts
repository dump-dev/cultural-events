import { faker } from "@faker-js/faker";

export const makeFakeCulturalEventData = (organizerId: string) => {
  return {
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    organizerId,
    location: {
      name: faker.location.state(),
      address: faker.location.street(),
      state: faker.location.state(),
      city: faker.location.city(),
      country: faker.location.country(),
      zipCode: faker.location.zipCode(),
    },
    date: faker.date.soon({ days: 15 }),
  };
};
