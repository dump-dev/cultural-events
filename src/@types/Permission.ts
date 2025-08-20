export const PermissionEnum = {
  USER_READ: "user:read",
  USER_CREATE: "user:create",
  USER_UPDATE: "user:update",
  USER_DELETE: "user:delete",

  LIKE_READ: "like:read",
  LIKE_CULTURAL_EVENT: "like:cultural-event",
  UNLIKE_CULTURAL_EVENT: "unlike:cultural-event",

  ORGANIZER_READ: "organizer:read",
  ORGANIZER_CREATE: "organizer:create",
  ORGANIZER_UPDATE: "organizer:update",
  ORGANIZER_DELETE: "organizer:delete",

  CULTURAL_EVENT_READ: "cultural-event:read",
  CULTURAL_EVENT_CREATE: "cultural-event:create",
  CULTURAL_EVENT_UPDATE: "cultural-event:update",
  CULTURAL_EVENT_DELETE: "cultural-event:delete",
} as const;

export const Permissions = Object.values(PermissionEnum)

export type Permission = typeof Permissions[number]