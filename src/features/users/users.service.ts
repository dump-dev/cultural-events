import { Repository } from "typeorm";
import User from "../../typeorm/entities/User";
import CulturalEvent from "../../typeorm/entities/CulturalEvent";
import { CreateUserDTO } from "./dtos/create-user.dto";
import { UserNotFoundError } from "../../errors/UserNotFoundError";
import { RoleEnum } from "../../constants/role";
import UserAlreadyExistsError from "../../errors/UserAlreadyExistsError";

export default class UsersService {
  constructor(
    private userRepository: Repository<User>,
    private culturalEvent: Repository<CulturalEvent>
  ) {}

  async create(userDTO: CreateUserDTO) {
    const hasUserWithEmail = await this.userRepository.findOneBy({
      authEmail: userDTO.email,
    });
    if (hasUserWithEmail) throw new UserAlreadyExistsError();
    const user = new User();
    user.name = userDTO.name;
    user.authEmail = userDTO.email;
    user.password = userDTO.password;
    user.role = RoleEnum.USER;
    return this.userRepository.save(user);
  }

  async getUsers() {
    return this.userRepository.find();
  }

  async getUserById(userId: string) {
    const user = await this.userRepository.findOneBy({id: userId})
    if (!user) throw new UserNotFoundError(userId);
    
    return user
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
