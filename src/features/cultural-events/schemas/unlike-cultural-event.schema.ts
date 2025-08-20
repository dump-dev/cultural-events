import * as z from "zod";

export const unlikeCulturalEventSchema = z.object({
    userId: z.string(),
    culturalEventId: z.string() 
}) 