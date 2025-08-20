import { Router } from "express";
import { AppDataSource } from "../../typeorm/data-source";
import CulturalEvent from "../../typeorm/entities/CulturalEvent";
import LikeCulturalEvent from "../../typeorm/entities/LikeCulturalEvent";
import Organizer from "../../typeorm/entities/Organizer";
import User from "../../typeorm/entities/User";
import CuturalEventsController from "./cultural-events.controller";
import CuturalEventsService from "./services/cultural-events.service";
import LikeCulturalEventService from "./services/like-cultural-events.service";

const culturalEventsRouter = Router();
const userRepository = AppDataSource.getRepository(User);
const organizerRepository = AppDataSource.getRepository(Organizer);
const culturalEventsRepository = AppDataSource.getRepository(CulturalEvent);
const likeCulturalEventRepository =
  AppDataSource.getRepository(LikeCulturalEvent);
const culturalEventsService = new CuturalEventsService(
  culturalEventsRepository,
  organizerRepository
);
const likeCulturalEventService = new LikeCulturalEventService(
  userRepository,
  culturalEventsRepository,
  likeCulturalEventRepository
);
const culturalEventsController = new CuturalEventsController(
  culturalEventsService,
  likeCulturalEventService
);

culturalEventsRouter.post("/", (req, res) =>
  culturalEventsController.create(req, res)
);
culturalEventsRouter.get("/", (req, res) =>
  culturalEventsController.getAll(req, res)
);
culturalEventsRouter.post("/:culturalEventId/like", (req, res) =>
  culturalEventsController.like(req, res)
);
culturalEventsRouter.delete("/:culturalEventId/like", (req, res) =>
  culturalEventsController.unlike(req, res)
);

export default culturalEventsRouter;
