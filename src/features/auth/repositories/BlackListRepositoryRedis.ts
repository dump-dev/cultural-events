import redisClient from "../../../redis-client/client";
import BlacklistRepository from "../types/BlacklistRepository";
import crypto from "node:crypto";

export default class BlacklistRepositoryRedis implements BlacklistRepository {
  async addItem(key: string, ttlInMs: number): Promise<void> {
    await redisClient.set(`blacklist:${this.hashedKey(key)}`, "", {
      PX: ttlInMs,
    });
  }

  async hasItem(key: string): Promise<boolean> {
    const exists = Boolean(
      await redisClient.exists(`blacklist:${this.hashedKey(key)}`)
    );
    return exists;
  }

  private hashedKey(key: string): string {
    return crypto.hash("sha1", key);
  }
}
