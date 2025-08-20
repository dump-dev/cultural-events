import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import AuthService from "./services/auth.service";
import { credentialsSchema } from "./validations/schemas/credentials.schema";

export default class AuthController {
  constructor(private authService: AuthService) {}

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
