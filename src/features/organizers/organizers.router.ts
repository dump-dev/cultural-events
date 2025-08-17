import { Router } from "express";
import { AppDataSource } from "../../typeorm/data-source";
import OrganizersService from "./services/organizers.service";
import OrganizersController from "./organizers.controller";
import Organizer from "../../typeorm/entities/Organizer";

const organizersRouter = Router();

const organizersRepository = AppDataSource.getRepository(Organizer);
const organizersService = new OrganizersService(organizersRepository);
const organizerContoller = new OrganizersController(organizersService);
organizersRouter.post("/", (req, res) => organizerContoller.create(req, res));
organizersRouter.get("/", (req, res) => organizerContoller.getAll(req, res));

export default organizersRouter;
