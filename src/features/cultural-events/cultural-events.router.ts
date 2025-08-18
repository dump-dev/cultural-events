import { Router } from "express";
import { AppDataSource } from "../../typeorm/data-source";
import Organizer from "../../typeorm/entities/Organizer";
import CulturalEvent from "../../typeorm/entities/CulturalEvent";
import CuturalEventsController from "./cultural-events.controller";
import CuturalEventsService from "./services/cultural-events.service";

const culturalEventsRouter = Router();
const organizerRepository = AppDataSource.getRepository(Organizer);
const culturalEventsRepository = AppDataSource.getRepository(CulturalEvent);
const culturalEventsService = new CuturalEventsService(
  culturalEventsRepository,
  organizerRepository
);
const culturalEventsController = new CuturalEventsController(
  culturalEventsService
);

culturalEventsRouter.post("/", (req, res) =>
  culturalEventsController.create(req, res)
);
culturalEventsRouter.get("/", (req, res) =>
  culturalEventsController.getAll(req, res)
);

export default culturalEventsRouter;
