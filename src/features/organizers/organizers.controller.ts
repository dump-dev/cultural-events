import { Request, Response } from "express";
import OrganizersService from "./organizers.service";
import { StatusCodes } from "http-status-codes";
import { createOrganizerSchema } from "./schemas/create-organizer.schema";
import OrganizerMapper from "./organizer.mapper";

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
      .send(OrganizerMapper.toDetailedDTO(organizer));
  }

  async getAll(req: Request, res: Response) {
    const organizers = await this.organizersService.getOrganizers();
    return res.send(organizers.map(OrganizerMapper.toSummaryDTO));
  }
}
