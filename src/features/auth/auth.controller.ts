import { Request, Response } from "express";
import RegiserUserService from "./services/register-user.service";
import registerUserSchema from "./validations/schemas/register-user.schema";
import { StatusCodes } from "http-status-codes";
import AuthService from "./services/auth.service";
import { credentialsSchema } from "./validations/schemas/credentials.schema";

export default class AuthController {
  constructor(
    private createUserService: RegiserUserService,
    private authService: AuthService
  ) {}

  async registerUser(req: Request, res: Response) {
    const parseResult = registerUserSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(StatusCodes.BAD_REQUEST).send(parseResult.error.issues);
    }
    const userParsed = parseResult.data;
    const user = await this.createUserService.create(userParsed);
    return res.status(StatusCodes.CREATED).send(user);
  }

  async login(req: Request, res: Response) {
    const parseResult = credentialsSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(StatusCodes.BAD_REQUEST).send(parseResult.error.issues);
    }
    const credentialsParsed = parseResult.data;
    const tokens = await this.authService.login(credentialsParsed);
    return res.send({ ...tokens });
  }
}
