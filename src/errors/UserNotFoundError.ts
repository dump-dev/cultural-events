export class UserNotFoundError extends Error {
  constructor(id: string) {
    super(`Not found organizer with id: ${id}`);
    this.name = "UserNotFoundError";
  }
}
