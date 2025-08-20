import { Repository } from "typeorm";
import { UserNotFoundError } from "../../../@types/errors/UserNotFoundError";
import CulturalEvent from "../../../typeorm/entities/CulturalEvent";
import User from "../../../typeorm/entities/User";
import { CreateUserDTO } from "../dtos/create-user.dto";

export default class UsersService {
  constructor(
    private userRepository: Repository<User>,
    private culturalEvent: Repository<CulturalEvent>
  ) {}

  async create(userDTO: CreateUserDTO ) {
    const user = new User();
    user.name = userDTO.name;
    user.authEmail = userDTO.email;
    user.password = userDTO.password;
    return this.userRepository.save(user);
  }

  async getUsers() {
    return this.userRepository.find();
  }

  async getLikes(userId: string) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) throw new UserNotFoundError(userId);

    return this.culturalEvent.find({
      where: {
        likes: {
          user_id: userId,
        },
      },
    });
  }
}
