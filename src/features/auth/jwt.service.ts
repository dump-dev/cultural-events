import jwt from "jsonwebtoken";
import { AccessPayload } from "./types/AccessPayload";
import BlacklistRepository from "./types/BlacklistRepository";
import BlacklistRepositoryRedis from "./repositories/BlackListRepositoryRedis";
import { CreateAccessTokenDTO } from "./dtos/create-access-token.dto";

const blacklistRepository: BlacklistRepository = new BlacklistRepositoryRedis();

export class JwtService {
  static createAccessToken({ userId, firstName, role }: CreateAccessTokenDTO) {
    return jwt.sign({ firstName, role }, process.env.JWT_PRIVATE_KEY as string, {
      issuer: userId,
      expiresIn: "1m",
      algorithm: "RS256",
    });
  }

  static async verifyAccessToken(token: string) {
    try {
      const payload = jwt.verify(token, process.env.JWT_PUBLIC_KEY as string, {
        algorithms: ["RS256"],
      });
      if (await JwtService.isAccessTokenRevolked(token)) return;
      return payload as AccessPayload;
    } catch {
      return;
    }
  }

  static async revokeAccessToken(accessToken: string) {
    const { exp: tokenExpiration } = jwt.decode(accessToken) as AccessPayload;

    const expiration = tokenExpiration * 1000 - Date.now();

    if (expiration > 0) {
      return blacklistRepository.addItem(accessToken, expiration);
    }
  }

  static async isAccessTokenRevolked(accessToken: string) {
    return blacklistRepository.hasItem(accessToken);
  }
}
