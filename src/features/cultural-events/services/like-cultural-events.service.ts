import { Repository } from "typeorm";
import User from "../../../typeorm/entities/User";
import CulturalEvent from "../../../typeorm/entities/CulturalEvent";
import LikeCulturalEvent from "../../../typeorm/entities/LikeCulturalEvent";
import { LikeCulturalEventDTO } from "./dtos/like-cultural-event.dto";
import { UserNotFoundError } from "../../../@types/errors/UserNotFoundError";
import { CulturalEventNotFoundError } from "../../../@types/errors/CulturalEventNotFoundError";

export default class LikeCulturalEventService {
  constructor(
    private userReposotory: Repository<User>,
    private culturalEventRepository: Repository<CulturalEvent>,
    private likeCulturalEventRepository: Repository<LikeCulturalEvent>
  ) {}

  async like(likeDTO: LikeCulturalEventDTO) {
    const user = await this.userReposotory.findOneBy({ id: likeDTO.userId });
    if (!user) throw new UserNotFoundError(likeDTO.userId);

    const culturalEvent = await this.culturalEventRepository.findOneBy({
      id: likeDTO.culturalEventId,
    });
    if (!culturalEvent)
      throw new CulturalEventNotFoundError(likeDTO.culturalEventId);

    return this.likeCulturalEventRepository.save({ user, culturalEvent });
  }
}
