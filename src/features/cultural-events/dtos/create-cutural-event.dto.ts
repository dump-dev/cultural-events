type LocationDTO = {
  name: string;
  street: string;
  neighborhood: string;
  city: string;
  state: string;
  cep: string;
  propertyNumber: number
};

export type CreateCuturalEventDTO = {
  title: string;
  description: string;
  organizerId: string;
  location: LocationDTO;
  date: Date;
};
