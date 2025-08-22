import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Permission } from "../../@types/Permission";
import { Role } from "../../@types/Role";
import { AppDataSource } from "../../typeorm/data-source";
import RolePermission from "../../typeorm/entities/RolePermission";

export default function canPerform(
  action: Permission | Array<Permission>,
  requiredRole?: Role
) {
  const verifyByRole = async (role: Role) => {
    const rolePermissionRepository =
      AppDataSource.getRepository(RolePermission);

    const rolePermissions = await rolePermissionRepository.find({
      where: {
        role_name: role,
      },
    });

    return rolePermissions.some(({ permission_name }) =>
      Array.isArray(action)
        ? action.includes(permission_name)
        : permission_name === action
    );
  };

  return async (req: Request, res: Response, next: NextFunction) => {
    if (requiredRole && requiredRole !== req.user.role) {
      return res.sendStatus(StatusCodes.FORBIDDEN);
    }
    const userCanPerformAction = await verifyByRole(req.user.role);

    if (!userCanPerformAction) {
      return res.sendStatus(StatusCodes.FORBIDDEN)
    }

    return next();
  };
}
