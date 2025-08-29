export default class NotCulturalEventOwnerError extends Error {
  constructor() {
    super(`Not cultural event owner`);
    this.name = "NotCulturalEventOwnerError";
  }
}
