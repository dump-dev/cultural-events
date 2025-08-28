import { Repository } from "typeorm";
import { CreateCuturalEventDTO } from "./dtos/create-cutural-event.dto";
import Location from "../../typeorm/entities/Location";
import Organizer from "../../typeorm/entities/Organizer";
import CulturalEvent from "../../typeorm/entities/CulturalEvent";
import { OrganizerNotFoundError } from "../../errors/OrganizerNotFoundError";

export default class CuturalEventsService {
  constructor(
    private cuturalEventsRepository: Repository<CulturalEvent>,
    private organizerRepository: Repository<Organizer>
  ) {}

  async create(createDTO: CreateCuturalEventDTO) {
    const organizer = await this.organizerRepository.findOneBy({
      id: createDTO.organizerId,
    });

    if (!organizer) throw new OrganizerNotFoundError(createDTO.organizerId);

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

  async getCuturalEvents() {
    return this.cuturalEventsRepository.find({
      relations: { organizer: true, location: true },
    });
  }
}
