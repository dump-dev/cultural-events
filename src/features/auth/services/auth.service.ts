import { Repository } from "typeorm";
import User from "../../../typeorm/entities/User";
import { CredentialsDTO } from "./dtos/credentials.dto";
import jwt from "jsonwebtoken";
import { CreateAccessTokenDTO } from "./dtos/create-access-token.dto";

export default class AuthService {
  constructor(private userRepository: Repository<User>) {}

  async login(credentials: CredentialsDTO) {
    const user = await this.userRepository.findOneBy({
      authEmail: credentials.email,
    });

    if (!user) throw new InvalidCredentialsError();

    if (!(await user.verifyPassword(credentials.password)))
      throw new InvalidCredentialsError();

    const accessToken = AuthService.createAccessToken({
      userId: user.id,
      role: user.role,
    });

    return { accessToken };
  }

  private static createAccessToken({ userId, role }: CreateAccessTokenDTO) {
    return jwt.sign({ role }, "temporary_key", {
      issuer: userId,
      expiresIn: "1m",
    });
  }

  static verifyAccessToken(token: string) {
    try {
      return jwt.verify(token, "temporary_key");
    } catch {
      return false;
    }
  }
}

export class AuthError extends Error {}

export class InvalidTokenError extends AuthError {
  constructor() {
    super("invalid token");
    this.name = "InvalidTokenError";
  }
}

export class InvalidCredentialsError extends AuthError {
  constructor() {
    super("user or password is invalid");
    this.name = "AuthLoginUserNotFoundError";
  }
}
