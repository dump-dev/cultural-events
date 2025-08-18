import { Request, Response } from "express";
import UsersService from "./services/users.service";
import { getLikesSchema } from "./validations/schemas/get-likes.schema";
import { StatusCodes } from "http-status-codes";

export default class UsersController {
  constructor(private usersService: UsersService) {}

  async getAll(_: Request, res: Response) {
    const users = await this.usersService.getUsers();
    return res.send(users);
  }

  async getLikes(req: Request, res: Response) {
    const parseResult = getLikesSchema.safeParse(req.params);
    if (!parseResult.success) {
      return res.sendStatus(StatusCodes.NOT_FOUND);
    }

    const { userId } = parseResult.data;
    const likes = await this.usersService.getLikes(userId)
    return res.send(likes);
  }
}
