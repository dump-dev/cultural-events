import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { QueryFailedError } from "typeorm";
import { OrganizerNotFoundError } from "../@types/errors/OrganizerNotFoundError";
import { UserNotFoundError } from "../@types/errors/UserNotFoundError";
import { CulturalEventNotFoundError } from "../@types/errors/CulturalEventNotFoundError";
import LikeNotFoundError from "../@types/errors/LikeNotFoundError";
import { InvalidCredentialsError } from "../features/auth/types/InvalidCredentialsError";

export default function errorHandlerMiddleware(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!err) return next();

  if (err instanceof QueryFailedError) {
    const [, code] = Object.values(err.driverError);
    console.log(code);
    console.log(err);
    switch (code) {
      case "SQLITE_CONSTRAINT":
        return res.sendStatus(StatusCodes.CONFLICT);
      default:
        return res.sendStatus(StatusCodes.BAD_REQUEST);
    }
  }

  if (err instanceof OrganizerNotFoundError) {
    return res.status(StatusCodes.NOT_FOUND).send({
      message: err.message,
    });
  }

  if (err instanceof UserNotFoundError) {
    return res.status(StatusCodes.NOT_FOUND).send({
      message: err.message,
    });
  }

  if (err instanceof CulturalEventNotFoundError) {
    return res.status(StatusCodes.NOT_FOUND).send({
      message: err.message,
    });
  }

  if (err instanceof LikeNotFoundError) {
    return res.status(StatusCodes.NOT_FOUND).send({
      message: err.message,
    });
  }

  if (err instanceof InvalidCredentialsError) {
    return res.status(StatusCodes.UNAUTHORIZED).send({
      message: err.message,
    });
  }

  console.log(err);

  return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
}
