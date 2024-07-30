import { Redis, CACHE_PREFIX } from "../clients/redis";

const cacheOptions = {
  redisUrl: process.env.REDIS_URL || "redis://localhost:6379",
  redisOptions: {},
};

const cache = Redis.getInstance(cacheOptions);

export { CACHE_PREFIX, cache };
