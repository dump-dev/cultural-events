import * as z from "zod";

export const getLikesSchema = z.object({
    userId: z.string()
})