import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { JwtService } from "./jwt.service";

export default async function ensureAutheticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.headers.authorization?.startsWith("Bearer ")) {
    return res.sendStatus(StatusCodes.UNAUTHORIZED);
  }

  const [, accessToken] = req.headers.authorization.split(" ");
  const payload = await JwtService.verifyAccessToken(accessToken);
  if (!payload) {
    return res.sendStatus(StatusCodes.UNAUTHORIZED);
  }

  req.user = {
    id: payload.iss,
    role: payload.role,
  };
  return next();
}
