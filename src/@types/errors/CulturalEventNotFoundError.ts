export class CulturalEventNotFoundError extends Error {
  constructor(id: string) {
    super(`Not found cultural event with id: ${id}`);
    this.name = "CulturalEventNotFoundError";
  }
}
