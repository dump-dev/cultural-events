import * as z from "zod";

export const credentialsSchema = z.object({
  email: z.email(),
  password: z.string().min(1)
});
