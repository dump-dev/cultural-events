import { Repository } from "typeorm";
import User from "../../typeorm/entities/User";
import { CredentialsDTO } from "./dtos/credentials.dto";
import jwt from "jsonwebtoken";
import { CreateAccessTokenDTO } from "./dtos/create-access-token.dto";
import { InvalidCredentialsError } from "./types/InvalidCredentialsError";
import { AccessPayload } from "./types/AccessPayload";

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
    return jwt.sign({ role }, process.env.JWT_PRIVATE_KEY as string, {
      issuer: userId,
      expiresIn: "1m",
      algorithm: "RS256",
    });
  }

  static verifyAccessToken(token: string) {
    try {
      return jwt.verify(token, process.env.JWT_PUBLIC_KEY as string, {
        algorithms: ["RS256"],
      }) as AccessPayload;
    } catch {
      return false;
    }
  }
}
