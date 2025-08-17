import { Router } from "express";
import UsersController from "./users.controller";
import UsersService from "./services/users.service";
import { AppDataSource } from "../../typeorm/data-source";
import User from "../../typeorm/entities/User";

const usersRouter = Router();
const usersRepository = AppDataSource.getRepository(User);
const usersService = new UsersService(usersRepository);
const usersController = new UsersController(usersService);
usersRouter.get("/", (req, res) => usersController.getAll(req, res));

export default usersRouter