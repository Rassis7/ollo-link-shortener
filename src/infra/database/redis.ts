import Redis from "ioredis";

export enum PREFIX_ENUM {
  LINK_REFIX = "link:",
  USER_REFIX = "user:",
}

type PrefixType = keyof typeof PREFIX_ENUM;

export class Cache {
  redis: Redis;
  constructor() {
    this.redis = new Redis(process.env.REDIS_URL);
  }

  static async set(
    prefix: PrefixType,
    key: string,
    value: string | Record<string, unknown>
  ) {
    const cache = new Cache();

    const valueFormatted =
      typeof value !== "string" ? JSON.stringify(value) : value;

    await cache.redis.set(prefix + key, valueFormatted);
  }

  static async expire(prefix: PrefixType, key: string, value: number) {
    const cache = new Cache();
    await cache.redis.expire(prefix + key, value);
  }

  static async del(prefix: PrefixType, key: string) {
    const cache = new Cache();
    await cache.redis.del(prefix + key);
  }

  static async get(prefix: PrefixType, key: string) {
    const cache = new Cache();
    return cache.redis.get(prefix + key);
  }

  static async ttl(prefix: PrefixType, key: string) {
    const cache = new Cache();
    return cache.redis.ttl(prefix + key);
  }

  static async quit() {
    const cache = new Cache();
    await cache.redis.quit();
  }
}
