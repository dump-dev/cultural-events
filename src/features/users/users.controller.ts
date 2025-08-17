import { Request, Response } from "express";
import UsersService from "./services/users.service";

export default class UsersController {
  constructor(private usersService: UsersService) {}

  async getAll(_: Request, res: Response) {
    const users = await this.usersService.getUsers();
    return res.send(users)
  }
}
