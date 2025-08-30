import { Router } from "express";
import dataSource from "../../typeorm/data-source";
import CulturalEvent from "../../typeorm/entities/CulturalEvent";
import LikeCulturalEvent from "../../typeorm/entities/LikeCulturalEvent";
import Organizer from "../../typeorm/entities/Organizer";
import User from "../../typeorm/entities/User";
import CuturalEventsController from "./cultural-events.controller";
import CuturalEventsService from "./cultural-events.service";
import LikeCulturalEventService from "./like-cultural-events.service";
import ensureAutheticated from "../auth/ensure-autheticated.middleware";
import canPerform from "../permission/can-perform.middleware";
import { PermissionEnum } from "../../constants/permission";

const culturalEventsRouter = Router();
const userRepository = dataSource.getRepository(User);
const organizerRepository = dataSource.getRepository(Organizer);
const culturalEventsRepository = dataSource.getRepository(CulturalEvent);
const likeCulturalEventRepository = dataSource.getRepository(LikeCulturalEvent);
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

culturalEventsRouter.post(
  "/",
  ensureAutheticated,
  canPerform(PermissionEnum.CULTURAL_EVENT_CREATE),
  (req, res) => culturalEventsController.create(req, res)
);
culturalEventsRouter.patch(
  "/:culturalEventId",
  ensureAutheticated,
  canPerform(PermissionEnum.CULTURAL_EVENT_UPDATE),
  (req, res) => culturalEventsController.updateCulturalEventById(req, res)
);
culturalEventsRouter.delete(
  "/:culturalEventId",
  ensureAutheticated,
  canPerform(PermissionEnum.CULTURAL_EVENT_DELETE),
  (req, res) => culturalEventsController.deleteCulturalEventById(req, res)
);
culturalEventsRouter.get("/", (req, res) =>
  culturalEventsController.getAll(req, res)
);
culturalEventsRouter.get("/:culturalEventId", (req, res) =>
  culturalEventsController.getById(req, res)
);
culturalEventsRouter.post(
  "/:culturalEventId/like",
  ensureAutheticated,
  canPerform(PermissionEnum.LIKE_CULTURAL_EVENT),
  (req, res) => culturalEventsController.like(req, res)
);
culturalEventsRouter.delete(
  "/:culturalEventId/like",
  ensureAutheticated,
  canPerform(PermissionEnum.UNLIKE_CULTURAL_EVENT),
  (req, res) => culturalEventsController.unlike(req, res)
);

export default culturalEventsRouter;
