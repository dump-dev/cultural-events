import CulturalEvent from "../../typeorm/entities/CulturalEvent";
import { CulturalEventDetailedDTO } from "./dtos/cultural-event-detailed.dto";
import { CulturalEventSummaryDTO } from "./dtos/cultural-event-summary.dto";

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
        description: organizer.description,
        contacts: organizer.contacts ?? undefined,
      },
      location: {
        name: location.name,
        street: location.street,
        neighborhood: location.neighborhood,
        city: location.city,
        state: location.state,
        cep: location.cep,
        propertyNumber: location.propertyNumber,
      },
    };
  }

  static toSummaryDTO(culturalEvent: CulturalEvent): CulturalEventSummaryDTO {
    const { id, title, organizer, location, date } = culturalEvent;
    return {
      id,
      title,
      organizer: {
        id: organizer.id,
        name: organizer.displayName,
      },
      location: {
        name: location.name,
        city: location.city,
        state: location.state,
      },
      date,
    };
  }
}
