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
        address: location.address,
        city: location.city,
        state: location.state,
        country: location.country,
        zipCode: location.zipCode,
      },
    };
  }
}
