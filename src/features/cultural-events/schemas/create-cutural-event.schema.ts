import * as z from "zod";

const locationSchema = z.object({
  name: z.string(),
  street: z.string(),
  neighborhood: z.string(),
  city: z.string(),
  state: z.string(),
  cep: z.string().length(8),
  propertyNumber: z.int()
});

export const createCuturalEventSchema = z.object({
  title: z.string(),
  description: z.string(),
  organizerId: z.string(),
  location: locationSchema,
  date: z.iso.datetime().transform((isoDate) => new Date(isoDate)),
});
