export default class LikeNotFoundError extends Error {
  constructor() {
    super(`Like not found for this user and cultural event.`);
    this.name = "LikeNotFoundError";
  }
}
