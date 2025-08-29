import * as z from "zod";

export const deleteCulturalEventSchema = z.object({
  culturalEventId: z.string(),
});
