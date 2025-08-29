import * as z from "zod";

export const getByCulturalEventIdSchema = z.object({
  culturalEventId: z.string(),
});
