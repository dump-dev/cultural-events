import jwt from "jsonwebtoken";
import { AccessPayload } from "./types/AccessPayload";
import BlacklistRepository from "./types/BlacklistRepository";
import BlacklistRepositoryRedis from "./repositories/BlackListRepositoryRedis";

const blacklistRepository: BlacklistRepository = new BlacklistRepositoryRedis();

export class BlacklistService {
  static async addAccessToken(accessToken: string) {
    const { exp: tokenExpiration } = jwt.decode(accessToken) as AccessPayload;

    const expiration = tokenExpiration * 1000 - Date.now();

    if (expiration > 0) {
      return blacklistRepository.addItem(accessToken, expiration);
    }
  }

  static async isAccessTokenBlacklisted(accessToken: string) {
    return blacklistRepository.hasItem(accessToken);
  }
}
