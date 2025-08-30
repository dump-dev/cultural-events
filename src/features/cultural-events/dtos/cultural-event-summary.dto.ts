export type CulturalEventSummaryWithOrganizerDTO = {
  id: string;
  title: string;
  organizer: {
    id: string;
    name: string;
  };
  location: {
    name: string;
    city: string;
    state: string;
  };
  date: Date;
};

export type CulturalEventSummaryWithoutOrganizerDTO = Omit<
  CulturalEventSummaryWithOrganizerDTO,
  "organizer"
>;
