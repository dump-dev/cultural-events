import * as z from "zod";

export const getCulturalEventsByOrganizerId = z.object({
  organizerId: z.string()
})