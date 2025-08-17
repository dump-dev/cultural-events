import * as z from "zod";

const locationSchema = z.object({
  name: z.string(),
  address: z.string(),
  city: z.string(),
  state: z.string(),
  country: z.string(),
  zipCode: z.string(),
});

export const createCuturalEventSchema = z.object({
  title: z.string(),
  description: z.string(),
  organizerId: z.string(),
  location: locationSchema,
  date: z.iso.datetime().transform((isoDate) => new Date(isoDate)),
});
