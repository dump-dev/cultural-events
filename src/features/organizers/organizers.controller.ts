import { Request, Response } from "express";
import OrganizersService from "./services/organizers.service";
import { createOrganizerSchema } from "./validations/schemas/create-organizer.schema";
import { StatusCodes } from "http-status-codes";

export default class OrganizersController {
  constructor(private organizersService: OrganizersService) {}

  async create(req: Request, res: Response) {
    const parseResult = createOrganizerSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(StatusCodes.BAD_REQUEST).send(parseResult.error.issues);
    }
    const organizerParsed = parseResult.data;
    const organizer = await this.organizersService.create(organizerParsed);
    return res.send(organizer);
  }

  async getAll(req: Request, res: Response) {
    const organizers = await this.organizersService.getOrganizers()
    return res.send(organizers)
  }
}
