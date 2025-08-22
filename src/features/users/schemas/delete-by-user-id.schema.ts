import * as z from "zod";

export const deleteByUserIdSchema = z.object({
  userId: z.string(),
});
