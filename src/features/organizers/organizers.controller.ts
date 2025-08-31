import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import OrganizerMapper from "./organizer.mapper";
import OrganizersService from "./organizers.service";
import { createOrganizerSchema } from "./schemas/create-organizer.schema";
import { getCulturalEventsByOrganizerId } from "./schemas/get-cultural-events-by-organizer-id.schema";
import { getOrganizerByIdSchema } from "./schemas/get-organizer-by-id.schema";
import { RoleEnum } from "../../constants/role";

export default class OrganizersController {
  constructor(private organizersService: OrganizersService) {}

  async create(req: Request, res: Response) {
    const parseResult = createOrganizerSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(StatusCodes.BAD_REQUEST).send(parseResult.error.issues);
    }
    const organizerParsed = parseResult.data;
    const organizer = await this.organizersService.create(organizerParsed);
    return res
      .status(StatusCodes.CREATED)
      .send(OrganizerMapper.toDetailedWithRoleDTO(organizer));
  }

  async getAll(req: Request, res: Response) {
    const organizers = await this.organizersService.getOrganizers();
    return res.send(organizers.map(OrganizerMapper.toSummaryDTO));
  }

  async getById(req: Request, res: Response) {
    const parseResult = getOrganizerByIdSchema.safeParse(req.params);
    if (!parseResult.success) {
      return res.status(StatusCodes.BAD_REQUEST).send(parseResult.error.issues);
    }
    const { organizerId } = parseResult.data;
    const organizer = await this.organizersService.getOrganizerById(
      organizerId
    );

    if (!req.user || req?.user?.role === RoleEnum.USER) {
      return res.send(OrganizerMapper.toPublicOrganizerDTO(organizer));
    }

    return res.send(OrganizerMapper.toDetailedWithoutRoleDTO(organizer));
  }

  async getEventsByOrganizerId(req: Request, res: Response) {
    const parseResult = getCulturalEventsByOrganizerId.safeParse(req.params);
    if (!parseResult.success) {
      return res.status(StatusCodes.BAD_REQUEST).send(parseResult.error.issues);
    }
    const { organizerId } = parseResult.data;
    const culturalEvents =
      await this.organizersService.findCulturalEventsByOrganizerId(organizerId);

    return res.send(OrganizerMapper.toOrganizerEventsDTO(culturalEvents));
  }
}
