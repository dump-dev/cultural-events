import { CulturalEventSummaryWithoutOrganizerDTO } from "../../cultural-events/dtos/cultural-event-summary.dto";
import { PublicOrganizerDTO } from "./public-organizer.dto";

export type OrganizerEventsDTO = {
  organizer: PublicOrganizerDTO;
  culturalEvents: Array<CulturalEventSummaryWithoutOrganizerDTO>;
};
