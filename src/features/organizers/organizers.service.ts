import { Repository } from "typeorm";
import Organizer from "../../typeorm/entities/Organizer";
import User from "../../typeorm/entities/User";
import { CreateOrganizersDTO } from "./dtos/create-organizer.dto";
import { RoleEnum } from "../../constants/role";
import UserAlreadyExistsError from "../../errors/UserAlreadyExistsError";
import { OrganizerNotFoundError } from "../../errors/OrganizerNotFoundError";
import CulturalEvent from "../../typeorm/entities/CulturalEvent";

export default class OrganizersService {
  constructor(
    private organizersRepository: Repository<Organizer>,
    private culturalEventsRepository: Repository<CulturalEvent>
  ) {}

  async create(organizerDTO: CreateOrganizersDTO) {
    const hasUserWithEmail = await this.organizersRepository.findOneBy({
      user: {
        authEmail: organizerDTO.email,
      },
    });
    if (hasUserWithEmail) throw new UserAlreadyExistsError();

    const user = new User();
    user.name = organizerDTO.name;
    user.authEmail = organizerDTO.email;
    user.password = organizerDTO.password;
    user.role = RoleEnum.ORGANIZER;

    const organizer = new Organizer();
    organizer.displayName = organizerDTO.displayName;
    organizer.description = organizerDTO.description;
    organizer.contacts = organizerDTO.contacts ?? null;
    organizer.user = user;

    return this.organizersRepository.save(organizer);
  }

  getOrganizers() {
    return this.organizersRepository.find({
      relations: { user: true },
    });
  }

  async getOrganizerById(organizerId: string) {
    const organizer = await this.organizersRepository.findOne({
      where: {
        id: organizerId,
      },
      relations: {
        user: true,
      },
    });

    if (!organizer) throw new OrganizerNotFoundError();
    return organizer;
  }

  async findCulturalEventsByOrganizerId(organizerId: string) {
    return this.culturalEventsRepository.find({
      where: {
        organizer: {
          id: organizerId,
        },
      },
      relations: {
        location: true,
      },
    });
  }
}
