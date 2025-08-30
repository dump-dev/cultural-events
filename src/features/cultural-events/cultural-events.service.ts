import { Repository } from "typeorm";
import { CreateCuturalEventDTO } from "./dtos/create-cutural-event.dto";
import Location from "../../typeorm/entities/Location";
import Organizer from "../../typeorm/entities/Organizer";
import CulturalEvent from "../../typeorm/entities/CulturalEvent";
import { OrganizerNotFoundError } from "../../errors/OrganizerNotFoundError";
import { UpdateCulturalEventDTO } from "./dtos/update-cultural-event.dto";
import { CulturalEventNotFoundError } from "../../errors/CulturalEventNotFoundError";
import NotCulturalEventOwnerError from "../../errors/NotCulturalEventOwnerError";
import { DeleteCulturalEventDTO } from "./dtos/delete-cultural-event.dto";

export default class CuturalEventsService {
  constructor(
    private cuturalEventsRepository: Repository<CulturalEvent>,
    private organizerRepository: Repository<Organizer>
  ) {}

  async create(createDTO: CreateCuturalEventDTO) {
    const organizer = await this.organizerRepository.findOneBy({
      id: createDTO.organizerId,
    });

    if (!organizer) throw new OrganizerNotFoundError();

    const location = new Location();
    location.name = createDTO.location.name;
    location.street = createDTO.location.street;
    location.neighborhood = createDTO.location.neighborhood;
    location.city = createDTO.location.city;
    location.state = createDTO.location.state;
    location.propertyNumber = createDTO.location.propertyNumber;
    location.cep = createDTO.location.cep;

    const cuturalEvent = new CulturalEvent();
    cuturalEvent.title = createDTO.title;
    cuturalEvent.description = createDTO.description;
    cuturalEvent.date = createDTO.date;
    cuturalEvent.organizer = organizer;
    cuturalEvent.location = location;

    return this.cuturalEventsRepository.save(cuturalEvent);
  }

  async updateCulturalEvent(updateDTO: UpdateCulturalEventDTO) {
    const culturalEvent = await this.getCulturalEventById(
      updateDTO.culturalEventId
    );

    if (culturalEvent.organizer.id !== updateDTO.organizerId)
      throw new NotCulturalEventOwnerError();

    const location = new Location();
    location.id = culturalEvent.location.id;
    location.name = updateDTO.location?.name ?? culturalEvent.location.name;
    location.street =
      updateDTO.location?.street ?? culturalEvent.location.street;
    location.neighborhood =
      updateDTO.location?.neighborhood ?? culturalEvent.location.neighborhood;
    location.city = updateDTO.location?.city ?? culturalEvent.location.city;
    location.state = updateDTO.location?.state ?? culturalEvent.location.state;
    location.propertyNumber =
      updateDTO.location?.propertyNumber ??
      culturalEvent.location.propertyNumber;
    location.cep = updateDTO.location?.cep ?? culturalEvent.location.cep;

    culturalEvent.title = updateDTO.title ?? culturalEvent.title;
    culturalEvent.description =
      updateDTO.description ?? culturalEvent.description;
    culturalEvent.date = updateDTO.date ?? culturalEvent.date;
    culturalEvent.location = location;

    return this.cuturalEventsRepository.save(culturalEvent);
  }

  async getOrganizerIdByUserId(userId: string) {
    const organizer = await this.organizerRepository.findOneBy({
      user: { id: userId },
    });

    if (!organizer) throw new OrganizerNotFoundError();

    return organizer.id;
  }

  async getCuturalEvents() {
    return this.cuturalEventsRepository.find({
      relations: { organizer: true, location: true },
    });
  }

  async getCulturalEventById(culturalEventId: string) {
    const culturalEvent = await this.cuturalEventsRepository.findOne({
      where: { id: culturalEventId },
      relations: {
        organizer: true,
        location: true,
      },
    });

    if (!culturalEvent) throw new CulturalEventNotFoundError(culturalEventId);
    return culturalEvent;
  }

  async deleteCulturalEvent(deleteDTO: DeleteCulturalEventDTO) {
    const culturalEvent = await this.cuturalEventsRepository.findOne({
      where: {
        id: deleteDTO.culturalEventId,
      },
      relations: {
        organizer: true,
      },
    });

    if (!culturalEvent)
      throw new CulturalEventNotFoundError(deleteDTO.culturalEventId);
    if (culturalEvent.organizer.id !== deleteDTO.organizerId)
      throw new NotCulturalEventOwnerError();

    await this.cuturalEventsRepository.delete({
      id: deleteDTO.culturalEventId,
    });
  }
}
