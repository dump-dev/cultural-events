import { Repository } from "typeorm";
import User from "../../typeorm/entities/User";
import CulturalEvent from "../../typeorm/entities/CulturalEvent";
import LikeCulturalEvent from "../../typeorm/entities/LikeCulturalEvent";
import { LikeCulturalEventDTO } from "./dtos/like-cultural-event.dto";
import { UserNotFoundError } from "../../errors/UserNotFoundError";
import { CulturalEventNotFoundError } from "../../errors/CulturalEventNotFoundError";
import { UnlikeCulturalEventDTO } from "./dtos/unlike-cultural-event.dto";
import LikeNotFoundError from "../../errors/LikeNotFoundError";

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

  async unlike(unlikeDTO: UnlikeCulturalEventDTO) {
    const like = await this.likeCulturalEventRepository.findOneBy({
      user_id: unlikeDTO.userId,
      cultural_event_id: unlikeDTO.culturalEventId,
    });

    if (!like) throw new LikeNotFoundError();

    return this.likeCulturalEventRepository.remove(like);
  }
}
