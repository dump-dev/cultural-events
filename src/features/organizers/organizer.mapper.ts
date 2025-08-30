import Organizer from "../../typeorm/entities/Organizer";
import UserMapper from "../users/user.mapper";
import { OrganizerDetailedDTO } from "./dtos/organizer-detailed.dto";
import { OrganizerSummaryDTO } from "./dtos/organizer-summary.dto";

export default class OrganizerMapper {
  static toDetailedDTO(organizer: Organizer): OrganizerDetailedDTO {
    const { id, displayName, contacts, description, user } = organizer;

    return {
      id,
      displayName,
      description,
      user: UserMapper.toDTO(user),
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
