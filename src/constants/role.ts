export const RoleEnum = {
  USER: "user",
  ORGANIZER: "organizer",
  ADMIN: "admin",
} as const;

export const roles = Object.values(RoleEnum);
