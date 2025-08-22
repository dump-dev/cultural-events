import * as z from "zod";

export const getByUserIdSchema = z.object({
  userId: z.string(),
});
