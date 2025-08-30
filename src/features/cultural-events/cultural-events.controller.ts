import { Request, Response } from "express";
import CuturalEventsService from "./cultural-events.service";
import { createCuturalEventSchema } from "./schemas/create-cutural-event.schema";
import { StatusCodes } from "http-status-codes";
import LikeCulturalEventService from "./like-cultural-events.service";
import { likeCulturalEventSchema } from "./schemas/like-cultural-event.schema";
import { unlikeCulturalEventSchema } from "./schemas/unlike-cultural-event.schema";
import { CulturalEventMapper } from "./cultural-event-mapper";
import { updateCulturalEventSchema } from "./schemas/update-cultural.event.schema";
import { deleteCulturalEventSchema } from "./schemas/delete-cultural-event.schema";
import { getByCulturalEventIdSchema } from "./schemas/get-by-cultural-event-id.schema";

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
    return res
      .status(StatusCodes.CREATED)
      .send(CulturalEventMapper.toDetailedDTO(culturalEvent));
  }

  async getAll(req: Request, res: Response) {
    const culturalEvents = await this.eventsService.getCuturalEvents();
    return res.send(culturalEvents.map(CulturalEventMapper.toSummaryWithOrganizerDTO));
  }

  async getById(req: Request, res: Response) {
    const parseResult = getByCulturalEventIdSchema.safeParse(req.params);
    if (!parseResult.success) {
      return res.status(StatusCodes.BAD_REQUEST).send(parseResult.error.issues);
    }
    const culturalEvent = await this.eventsService.getCulturalEventById(
      parseResult.data.culturalEventId
    );
    return res.send(CulturalEventMapper.toDetailedDTO(culturalEvent!));
  }

  async updateCulturalEventById(req: Request, res: Response) {
    const parseResult = updateCulturalEventSchema.safeParse({
      culturalEventId: req.params.culturalEventId,
      ...req.body,
    });

    if (!parseResult.success) {
      return res.status(StatusCodes.BAD_REQUEST).send(parseResult.error.issues);
    }

    const updateDTO = {
      organizerId: await this.eventsService.getOrganizerIdByUserId(req.user.id),
      ...parseResult.data,
    };

    const updatedCultural = await this.eventsService.updateCulturalEvent(
      updateDTO
    );
    return res.send(CulturalEventMapper.toDetailedDTO(updatedCultural!));
  }

  async deleteCulturalEventById(req: Request, res: Response) {
    const parseResult = deleteCulturalEventSchema.safeParse(req.params);
    if (!parseResult.success) {
      return res.status(StatusCodes.BAD_REQUEST).send(parseResult.error.issues);
    }

    const deleteDTO = {
      organizerId: await this.eventsService.getOrganizerIdByUserId(req.user.id),
      ...parseResult.data,
    };

    await this.eventsService.deleteCulturalEvent(deleteDTO);

    return res.sendStatus(StatusCodes.NO_CONTENT);
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
