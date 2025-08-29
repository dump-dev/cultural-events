export class OrganizerNotFoundError extends Error {
  constructor() {
    super(`Not Found Organizer`);
    this.name = "OrganizerNotFoundError";
  }
}
