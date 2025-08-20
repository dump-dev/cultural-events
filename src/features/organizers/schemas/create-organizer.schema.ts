import * as z from "zod";
import { ContactType } from "../types/OrganizerContact";
import createUserSchema from "../../users/schemas/create-user.schema";


const contacstSchema = z
  .object({
    [ContactType.website]: z.url({ protocol: /^https$/ }),
    [ContactType.email]: z.email(),
    [ContactType.instagram]: z.string(),
    [ContactType.phoneNumber]: z.array(z.string()),
  })
  .partial();
  
export const createOrganizerSchema = z.object({
  ...createUserSchema.shape,
  displayName: z.string().min(3),
  description: z.string().min(3),
  contacts: contacstSchema.optional(),
});
