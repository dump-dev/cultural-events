import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { QueryFailedError } from "typeorm";

export default function errorHandlerMiddleware(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!err) return next();

  if (err instanceof QueryFailedError) {
    const [, code] = Object.values(err.driverError);
    console.log(code)
    switch (code) {
      case "SQLITE_CONSTRAINT":
        return res.sendStatus(StatusCodes.CONFLICT);
      default:
        return res.sendStatus(StatusCodes.BAD_REQUEST);
    }
  }

  console.log(err)

  return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
}
