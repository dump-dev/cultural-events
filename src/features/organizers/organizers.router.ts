import { Router } from "express";
import dataSource from "../../typeorm/data-source";
import OrganizersService from "./organizers.service";
import OrganizersController from "./organizers.controller";
import Organizer from "../../typeorm/entities/Organizer";
import ensureAutheticated from "../auth/ensure-autheticated.middleware";
import canPerform from "../permission/can-perform.middleware";
import { PermissionEnum } from "../../constants/permission";

const organizersRouter = Router();

const organizersRepository = dataSource.getRepository(Organizer);
const organizersService = new OrganizersService(organizersRepository);
const organizerContoller = new OrganizersController(organizersService);
organizersRouter.post("/", (req, res) => organizerContoller.create(req, res));
organizersRouter.get(
  "/",
  ensureAutheticated,
  canPerform(PermissionEnum.ORGANIZER_LIST),
  (req, res) => organizerContoller.getAll(req, res)
);

export default organizersRouter;
