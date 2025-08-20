import { Request, Response } from "express";
import UsersService from "./users.service";
import { getLikesSchema } from "./schemas/get-likes.schema";
import { StatusCodes } from "http-status-codes";
import createUserSchema from "./schemas/create-user.schema";

export default class UsersController {
  constructor(private usersService: UsersService) {}

  async create(req: Request, res: Response) {
    const parseResult = createUserSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(StatusCodes.BAD_REQUEST).send(parseResult.error.issues);
    }
    const userParsed = parseResult.data;
    const user = await this.usersService.create(userParsed);
    return res.status(StatusCodes.CREATED).send(user);
  }

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
    const likes = await this.usersService.getLikes(userId);
    return res.send(likes);
  }
}
