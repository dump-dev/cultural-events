import { Request, Response } from "express";
import CreateUserService from "./services/create-user.service";
import registerUserSchema from "./validations/schemas/register-user.schema";
import { StatusCodes } from "http-status-codes";

export default class AuthController {
  constructor(private createUserService: CreateUserService) {}

  async registerUser(req: Request, res: Response) {
    const parseResult = registerUserSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(StatusCodes.BAD_REQUEST).send(parseResult.error.issues);
    }
    const userParsed = parseResult.data;
    const user = await this.createUserService.create(userParsed);
    return res.status(StatusCodes.CREATED).send(user);
  }
}
