import CulturalEvent from "../../typeorm/entities/CulturalEvent";
import Organizer from "../../typeorm/entities/Organizer";
import { CulturalEventMapper } from "../cultural-events/cultural-event-mapper";
import {
  OrganizerDetailedWithoutRoleDTO,
  OrganizerDetailedWithRoleDTO,
} from "./dtos/organizer-detailed.dto";
import { OrganizerEventsDTO } from "./dtos/organizer-events.dto";
import { OrganizerSummaryDTO } from "./dtos/organizer-summary.dto";
import { PublicOrganizerDTO } from "./dtos/public-organizer.dto";

export default class OrganizerMapper {
  static toDetailedWithoutRoleDTO(
    organizer: Organizer
  ): OrganizerDetailedWithoutRoleDTO {
    const { id, displayName, contacts, description, user } = organizer;

    return {
      id,
      displayName,
      description,
      user: {
        id: user.id,
        name: user.name,
        authEmail: user.authEmail,
      },
      contacts: contacts ?? undefined,
    };
  }

  static toDetailedWithRoleDTO(
    organizer: Organizer
  ): OrganizerDetailedWithRoleDTO {
    const { id, displayName, contacts, description, user } = organizer;

    return {
      id,
      displayName,
      description,
      user: {
        id: user.id,
        name: user.name,
        authEmail: user.authEmail,
        role: user.role,
      },
      contacts: contacts ?? undefined,
    };
  }

  static toSummaryDTO(organizer: Organizer): OrganizerSummaryDTO {
    const { id, displayName, user } = organizer;

    return {
      id,
      displayName,
      user: {
        id: user.id,
        name: user.name,
        authEmail: user.authEmail,
      },
    };
  }

  static toPublicOrganizerDTO(organizer: Organizer): PublicOrganizerDTO {
    return {
      id: organizer.id,
      displayName: organizer.displayName,
      description: organizer.description,
      ...organizer?.contacts,
    };
  }

  static toOrganizerEventsDTO(
    culturalEvents: Array<CulturalEvent>
  ): OrganizerEventsDTO {
    return culturalEvents.map(CulturalEventMapper.toSummaryWithoutOrganizerDTO);
  }
}
