import { Router } from "express";
import { AppDataSource } from "../../typeorm/data-source";
import Organizer from "../../typeorm/entities/Organizer";
import CulturalEvent from "../../typeorm/entities/CulturalEvent";
import CuturalEventsController from "./events.controller";
import CuturalEventsService from "./services/cultural-events.service";

const culturlaEventsRouter = Router();
const organizerRepository = AppDataSource.getRepository(Organizer);
const culturalEventsRepository = AppDataSource.getRepository(CulturalEvent);
const culturalEventsService = new CuturalEventsService(
  culturalEventsRepository,
  organizerRepository
);
const culturalEventsController = new CuturalEventsController(
  culturalEventsService
);

culturlaEventsRouter.post("/", (req, res) =>
  culturalEventsController.create(req, res)
);
culturlaEventsRouter.get("/", (req, res) =>
  culturalEventsController.getAll(req, res)
);

export default culturlaEventsRouter;
