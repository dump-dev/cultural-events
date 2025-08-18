import { Repository } from "typeorm";
import { UserNotFoundError } from "../../../@types/errors/UserNotFoundError";
import CulturalEvent from "../../../typeorm/entities/CulturalEvent";
import User from "../../../typeorm/entities/User";

export default class UsersService {
  constructor(
    private usersRepository: Repository<User>,
    private culturalEvent: Repository<CulturalEvent>
  ) {}

  async getUsers() {
    return this.usersRepository.find();
  }

  async getLikes(userId: string) {
    const user = await this.usersRepository.findOneBy({ id: userId });
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
