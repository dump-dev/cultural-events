import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import AuthService from "../features/auth/services/auth.service";

export default async function ensureAutheticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.headers.authorization?.startsWith("Bearer ")) {
    return res.sendStatus(StatusCodes.UNAUTHORIZED);
  }

  const [, accessToken] = req.headers.authorization.split(" ");

  if (!AuthService.verifyAccessToken(accessToken)) {
    return res.sendStatus(StatusCodes.UNAUTHORIZED);
  }

  return next();
}
