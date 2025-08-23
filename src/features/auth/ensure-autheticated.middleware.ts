import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import AuthService from "./auth.service";
import { BlacklistService } from "./blacklist.service";

export default async function ensureAutheticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.headers.authorization?.startsWith("Bearer ")) {
    return res.sendStatus(StatusCodes.UNAUTHORIZED);
  }

  const [, accessToken] = req.headers.authorization.split(" ");
  const payload = AuthService.verifyAccessToken(accessToken);
  if (!payload) {
    return res.sendStatus(StatusCodes.UNAUTHORIZED);
  }
  if (await BlacklistService.isAccessTokenBlacklisted(accessToken)) {
    return res.sendStatus(StatusCodes.UNAUTHORIZED);
  }

  req.user = {
    id: payload.iss,
    role: payload.role,
  };
  return next();
}
