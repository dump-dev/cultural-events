import { AuthError } from "./AuthError";

export class InvalidCredentialsError extends AuthError {
  constructor() {
    super("user or password is invalid");
    this.name = "AuthLoginUserNotFoundError";
  }
}
