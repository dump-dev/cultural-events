type LocationDTO = {
  name: string;
  street: string;
  neighborhood: string;
  city: string;
  state: string;
  cep: string;
  propertyNumber: number;
};

export type UpdateCulturalEventDTO = {
  culturalEventId: string;
  organizerId: string;
} & Partial<{
  title: string;
  description: string;
  date: Date;
  location?: Partial<LocationDTO>;
}>;
