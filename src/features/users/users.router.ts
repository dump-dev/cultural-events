import { Router } from "express";
import { PermissionEnum } from "../../constants/permission";
import { RoleEnum } from "../../constants/role";
import dataSource from "../../typeorm/data-source";
import CulturalEvent from "../../typeorm/entities/CulturalEvent";
import User from "../../typeorm/entities/User";
import ensureAutheticated from "../auth/ensure-autheticated.middleware";
import canPerform from "../permission/can-perform.middleware";
import UsersController from "./users.controller";
import UsersService from "./users.service";

const usersRouter = Router();
const usersRepository = dataSource.getRepository(User);
const culturalEventRepository = dataSource.getRepository(CulturalEvent);

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
  "/me",
  ensureAutheticated,
  canPerform(PermissionEnum.USER_DETAILS),
  (req, res) => usersController.getMe(req, res)
);
usersRouter.delete(
  "/me",
  ensureAutheticated,
  canPerform(PermissionEnum.USER_DELETE),
  (req, res) => usersController.deleteMe(req, res)
);
usersRouter.get(
  "/:userId",
  ensureAutheticated,
  canPerform(PermissionEnum.USER_DETAILS, RoleEnum.ADMIN),
  (req, res) => usersController.getById(req, res)
);
usersRouter.delete(
  "/:userId",
  ensureAutheticated,
  canPerform(PermissionEnum.USER_DETAILS, RoleEnum.ADMIN),
  (req, res) => usersController.deleteById(req, res)
);

usersRouter.get(
  "/:userId/likes",
  ensureAutheticated,
  canPerform(PermissionEnum.LIKE_DETAILS),
  (req, res) => usersController.getLikes(req, res)
);

export default usersRouter;
