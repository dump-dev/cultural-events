import { Request, Response } from "express";
import CuturalEventsService from "./cultural-events.service";
import { createCuturalEventSchema } from "./schemas/create-cutural-event.schema";
import { StatusCodes } from "http-status-codes";
import LikeCulturalEventService from "./like-cultural-events.service";
import { likeCulturalEventSchema } from "./schemas/like-cultural-event.schema";
import { unlikeCulturalEventSchema } from "./schemas/unlike-cultural-event.schema";

export default class CuturalEventsController {
  constructor(
    private eventsService: CuturalEventsService,
    private likeCulturalEventService: LikeCulturalEventService
  ) {}

  async create(req: Request, res: Response) {
    const parseResult = createCuturalEventSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(StatusCodes.BAD_REQUEST).send(parseResult.error.issues);
    }
    const culturalEventParsed = parseResult.data;
    const culturalEvent = await this.eventsService.create(culturalEventParsed);
    return res.send(culturalEvent);
  }

  async getAll(req: Request, res: Response) {
    const culturalEvents = await this.eventsService.getCuturalEvents();
    return res.status(StatusCodes.CREATED).send(culturalEvents);
  }

  async like(req: Request, res: Response) {
    const parseResult = likeCulturalEventSchema.safeParse({
      culturalEventId: req.params?.culturalEventId,
      userId: req.body?.userId,
    });

    if (!parseResult.success) {
      return res.status(StatusCodes.BAD_REQUEST).send(parseResult.error.issues);
    }

    const likeCulturalEvent = await this.likeCulturalEventService.like(
      parseResult.data
    );
    return res.status(StatusCodes.CREATED).send(likeCulturalEvent);
  }

  async unlike(req: Request, res: Response) {
    const parseResult = unlikeCulturalEventSchema.safeParse({
      culturalEventId: req.params?.culturalEventId,
      userId: req.body?.userId,
    });

    if (!parseResult.success) {
      return res.status(StatusCodes.BAD_REQUEST).send(parseResult.error.issues);
    }

    await this.likeCulturalEventService.unlike(parseResult.data);
    return res.sendStatus(StatusCodes.NO_CONTENT);
  }
}
