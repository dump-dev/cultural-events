import * as z from "zod";

export const getOrganizerByIdSchema = z.object({
  organizerId: z.string(),
});
