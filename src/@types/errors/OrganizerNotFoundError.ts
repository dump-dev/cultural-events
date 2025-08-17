export class OrganizerNotFoundError extends Error {
  constructor(id: string) {
    super(`Not Found Organizer with id: ${id}`);
    this.name = "OrganizerNotFoundError";
  }
}
