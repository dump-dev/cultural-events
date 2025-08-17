import { Repository } from "typeorm";
import Organizer from "../../../typeorm/entities/Organizer";
import User from "../../../typeorm/entities/User";
import { CreateOrganizersDTO } from "./dtos/create-organizer.dto";

export default class OrganizersService {
  constructor(private organizersRepository: Repository<Organizer>) {}

  async create(createOrganizerDTO: CreateOrganizersDTO) {
    const user = new User();
    user.name = createOrganizerDTO.name;
    user.authEmail = createOrganizerDTO.email;
    user.password = createOrganizerDTO.password;

    const organizer = new Organizer();
    organizer.displayName = createOrganizerDTO.displayName;
    organizer.description = createOrganizerDTO.description;
    organizer.contacts = createOrganizerDTO.contacts ?? null
    organizer.user = user;

    return this.organizersRepository.save(organizer);
  }

  getOrganizers() {
    return this.organizersRepository.find()
  }
}
