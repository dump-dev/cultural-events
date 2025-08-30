import { RoleEnum } from "../constants/role";
import { PermissionEnum } from "../constants/permission";

const rolePermissions = {
  [RoleEnum.USER]: [
    PermissionEnum.USER_DETAILS,
    PermissionEnum.USER_CREATE,
    PermissionEnum.USER_UPDATE,
    PermissionEnum.USER_DELETE,

    PermissionEnum.LIKE_DETAILS,
    PermissionEnum.LIKE_CULTURAL_EVENT,
    PermissionEnum.UNLIKE_CULTURAL_EVENT,

    PermissionEnum.CULTURAL_EVENT_LIST,
  ],

  [RoleEnum.ORGANIZER]: [
    PermissionEnum.ORGANIZER_DETAILS,
    PermissionEnum.ORGANIZER_CREATE,
    PermissionEnum.ORGANIZER_UPDATE,
    PermissionEnum.ORGANIZER_DELETE,

    PermissionEnum.CULTURAL_EVENT_LIST,
    PermissionEnum.CULTURAL_EVENT_CREATE,
    PermissionEnum.CULTURAL_EVENT_UPDATE,
    PermissionEnum.CULTURAL_EVENT_DELETE,
  ],

  [RoleEnum.ADMIN]: [
    PermissionEnum.USER_LIST,
    PermissionEnum.USER_DETAILS,

    PermissionEnum.USER_DELETE,

    PermissionEnum.ORGANIZER_LIST,
    PermissionEnum.ORGANIZER_DETAILS,
    PermissionEnum.ORGANIZER_DELETE,

    PermissionEnum.CULTURAL_EVENT_LIST,
    PermissionEnum.CULTURAL_EVENT_DELETE,
  ],
};

export default rolePermissions