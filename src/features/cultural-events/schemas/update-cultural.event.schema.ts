import * as z from "zod";

const locationSchema = z
  .object({
    name: z.string(),
    street: z.string(),
    neighborhood: z.string(),
    city: z.string(),
    state: z.string(),
    cep: z.string().length(8),
    propertyNumber: z.int(),
  })
  .partial();

export const updateCulturalEventSchema = z
  .object({
    culturalEventId: z.string(),
    title: z.string(),
    description: z.string(),
    date: z.iso.datetime().transform((isoDate) => new Date(isoDate)),
    location: locationSchema,
  })
  .partial()
  .required({ culturalEventId: true });

