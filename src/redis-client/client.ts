import { createClient } from "redis";

const redisClient = createClient({
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: (process.env.REDIS_PORT as number | undefined) || 6379,
  },
});

export async function connectRedis() {
  await redisClient.connect();
  console.log("✅ initialized redis connection");
}

export async function closeConnectionRedis() {
  await redisClient.quit();
  console.log("📴 closed redis connection");
}

export default redisClient;
