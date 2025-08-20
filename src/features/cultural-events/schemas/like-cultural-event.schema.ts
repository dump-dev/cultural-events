import * as z from "zod";

export const likeCulturalEventSchema = z.object({
    userId: z.string(),
    culturalEventId: z.string() 
}) 