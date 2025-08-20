export const ContactType = {
  email: "email",
  phoneNumber: "phoneNumber",
  website: "website",
  instagram: "instagram",
} as const;

export type OrganizerContacts = {
  [Property in keyof Omit<typeof ContactType, "phoneNumber">]?: string;
} & { phoneNumber?: Array<string> };
