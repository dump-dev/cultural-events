import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { JwtService } from "../auth/jwt.service";
import createUserSchema from "./schemas/create-user.schema";
import { deleteByUserIdSchema } from "./schemas/delete-by-user-id.schema";
import { getByUserIdSchema } from "./schemas/get-by-user-id.schema";
import { getLikesSchema } from "./schemas/get-likes.schema";
import UserMapper from "./user.mapper";
import UsersService from "./users.service";

export default class UsersController {
  constructor(private usersService: UsersService) {}

  async create(req: Request, res: Response) {
    const parseResult = createUserSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(StatusCodes.BAD_REQUEST).send(parseResult.error.issues);
    }
    const userParsed = parseResult.data;
    const user = await this.usersService.create(userParsed);
    return res.status(StatusCodes.CREATED).send(UserMapper.toDTO(user));
  }

  async getAll(_: Request, res: Response) {
    const users = await this.usersService.getUsers();
    return res.send(users.map(UserMapper.toDTO));
  }

  async getById(req: Request, res: Response) {
    const parseResult = getByUserIdSchema.safeParse(req.params);
    if (!parseResult.success) {
      return res.status(StatusCodes.BAD_REQUEST).send(parseResult.error.issues);
    }
    const { userId } = parseResult.data;

    const user = await this.usersService.getUserById(userId);
    return res.send(UserMapper.toDTO(user));
  }

  async getMe(req: Request, res: Response) {
    const user = await this.usersService.getUserById(req.user.id);

    return res.send(UserMapper.toDTO(user));
  }

  async deleteMe(req: Request, res: Response) {
    await this.usersService.deleteUserById(req.user.id);
    const [, accessToken] = req.headers.authorization!.split(" ");
    JwtService.revokeAccessToken(accessToken);
    return res.sendStatus(StatusCodes.NO_CONTENT);
  }

  async deleteById(req: Request, res: Response) {
    const parseResult = deleteByUserIdSchema.safeParse(req.params);
    if (!parseResult.success) {
      return res.status(StatusCodes.BAD_REQUEST).send(parseResult.error.issues);
    }

    return res.sendStatus(StatusCodes.NO_CONTENT);
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
