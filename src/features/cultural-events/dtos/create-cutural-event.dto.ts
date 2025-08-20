type LocationDTO = {
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
};

export type CreateCuturalEventDTO = {
  title: string;
  description: string;
  organizerId: string;
  location: LocationDTO;
  date: Date;
};
