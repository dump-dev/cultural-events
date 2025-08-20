import * as z from "zod";

const createUserSchema = z.object({
  name: z.string().min(3),
  email: z.email(),
  password: z.string().min(8),
});

export default createUserSchema
