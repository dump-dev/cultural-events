import { Repository } from "typeorm";
import Organizer from "../../typeorm/entities/Organizer";
import User from "../../typeorm/entities/User";
import { CreateOrganizersDTO } from "./dtos/create-organizer.dto";
import { RoleEnum } from "../../constants/role";
import UserAlreadyExistsError from "../../errors/UserAlreadyExistsError";

export default class OrganizersService {
  constructor(private organizersRepository: Repository<Organizer>) {}

  async create(organizerDTO: CreateOrganizersDTO) {
    const hasUserWithEmail = await this.organizersRepository.findOneBy({
      user: {
        authEmail: organizerDTO.email
      }
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
    return this.organizersRepository.find();
  }
}
