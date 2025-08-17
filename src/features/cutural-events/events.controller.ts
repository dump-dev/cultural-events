import { Request, Response } from "express";
import CuturalEventsService from "./services/cultural-events.service";
import { createCuturalEventSchema } from "./validations/schemas/create-cutural-event.schema";
import { StatusCodes } from "http-status-codes";

export default class CuturalEventsController {
  constructor(private eventsService: CuturalEventsService) {}

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
    return res.send(culturalEvents);
  }
}
