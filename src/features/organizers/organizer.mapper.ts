import Organizer from "../../typeorm/entities/Organizer";
import {
  OrganizerDetailedWithoutRoleDTO,
  OrganizerDetailedWithRoleDTO,
} from "./dtos/organizer-detailed.dto";
import { OrganizerSummaryDTO } from "./dtos/organizer-summary.dto";

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
}
