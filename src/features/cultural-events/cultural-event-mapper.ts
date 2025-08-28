import CulturalEvent from "../../typeorm/entities/CulturalEvent";
import { CulturalEventDetailedDTO } from "./dtos/cultural-event-detailed.dto";

export class CulturalEventMapper {
  static toDetailedDTO(culturalEvent: CulturalEvent): CulturalEventDetailedDTO {
    const { id, title, description, date, organizer, location } = culturalEvent;
    return {
      id,
      title,
      description,
      date: date.toISOString(),
      organizer: {
        id: organizer.id,
        displayName: organizer.displayName,
        deescription: organizer.description,
        contacts: organizer.contacts ?? undefined,
      },
      location: {
        name: location.name,
        street: location.street,
        neighborhood: location.neighborhood,
        city: location.city,
        state: location.state,
        cep: location.cep,
        propertyNumber: location.propertyNumber
      },
    };
  }
}
