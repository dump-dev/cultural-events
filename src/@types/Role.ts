export const RoleEnum = {
  USER: "user",
  ORGANIZER: "organizer",
  ADMIN: "admin",
} as const;

export const Roles = Object.values(RoleEnum);

export type Role = (typeof Roles)[number];
