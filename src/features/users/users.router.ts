import { Router } from "express";
import { AppDataSource } from "../../typeorm/data-source";
import CulturalEvent from "../../typeorm/entities/CulturalEvent";
import User from "../../typeorm/entities/User";
import UsersController from "./users.controller";
import UsersService from "./users.service";
import ensureAutheticated from "../auth/ensure-autheticated.middleware";
import canPerform from "../permission/can-perform.middleware";
import { PermissionEnum } from "../../constants/permission";

const usersRouter = Router();
const usersRepository = AppDataSource.getRepository(User);
const culturalEventRepository = AppDataSource.getRepository(CulturalEvent);

const usersService = new UsersService(usersRepository, culturalEventRepository);
const usersController = new UsersController(usersService);
usersRouter.post("/", (req, res) => usersController.create(req, res));
usersRouter.get(
  "/",
  ensureAutheticated,
  canPerform(PermissionEnum.USER_LIST),
  (req, res) => usersController.getAll(req, res)
);
usersRouter.get(
  "/:userId/likes",
  ensureAutheticated,
  canPerform(PermissionEnum.LIKE_DETAILS),
  (req, res) => usersController.getLikes(req, res)
);

export default usersRouter;
