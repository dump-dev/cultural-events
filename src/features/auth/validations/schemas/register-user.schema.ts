import * as z from "zod";

const registerUserSchema = z.object({
  name: z.string().min(3),
  email: z.email(),
  password: z.string().min(8),
});

export default registerUserSchema
