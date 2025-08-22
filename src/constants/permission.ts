export const PermissionEnum = {
  USER_LIST: "user:list",
  USER_DETAILS: "user:details",
  USER_CREATE: "user:create",
  USER_UPDATE: "user:update",
  USER_DELETE: "user:delete",

  LIKE_DETAILS: "like:details",
  LIKE_CULTURAL_EVENT: "like:cultural-event",
  UNLIKE_CULTURAL_EVENT: "unlike:cultural-event",

  ORGANIZER_LIST: "organizer:list",
  ORGANIZER_DETAILS: "organizer:details",
  ORGANIZER_CREATE: "organizer:create",
  ORGANIZER_UPDATE: "organizer:update",
  ORGANIZER_DELETE: "organizer:delete",

  CULTURAL_EVENT_LIST: "cultural-event:list",
  CULTURAL_EVENT_DETAILS: "cultural-event:details",
  CULTURAL_EVENT_CREATE: "cultural-event:create",
  CULTURAL_EVENT_UPDATE: "cultural-event:update",
  CULTURAL_EVENT_DELETE: "cultural-event:delete",
} as const;

export const permissions = Object.values(PermissionEnum);
