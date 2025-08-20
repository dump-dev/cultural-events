import { Router } from "express";
import UsersController from "./users.controller";
import UsersService from "./services/users.service";
import { AppDataSource } from "../../typeorm/data-source";
import User from "../../typeorm/entities/User";
import LikeCulturalEvent from "../../typeorm/entities/LikeCulturalEvent";
import CulturalEvent from "../../typeorm/entities/CulturalEvent";

const usersRouter = Router();
const usersRepository = AppDataSource.getRepository(User);
const culturalEventRepository =AppDataSource.getRepository(CulturalEvent)
  AppDataSource.getRepository(LikeCulturalEvent);
  
const usersService = new UsersService(
  usersRepository,
  culturalEventRepository
);
const usersController = new UsersController(usersService);
usersRouter.post("/", (req, res) => usersController.create(req, res));
usersRouter.get("/", (req, res) => usersController.getAll(req, res));
usersRouter.get("/:userId/likes", (req, res) => usersController.getLikes(req, res));

export default usersRouter;
