import Redis from "ioredis";

export enum CACHE_PREFIX {
  LINK = "link",
  AUTH = "auth",
}

export class Cache {
  instance: Redis;
  constructor() {
    this.instance = new Redis(process.env.REDIS_URL);
  }

  static getInstance() {
    const cache = new Cache();
    return cache.instance;
  }

  static async set(
    prefix: CACHE_PREFIX,
    key: string,
    value: string | Record<string, unknown>,
    expireInSeconds?: number
  ) {
    const cache = new Cache();

    const valueFormatted =
      typeof value !== "string" ? JSON.stringify(value) : value;

    await cache.instance.set(`${prefix}:${key}`, valueFormatted);

    if (expireInSeconds) {
      await cache.instance.expire(`${prefix}:${key}`, expireInSeconds);
    }
  }

  static async expire(prefix: CACHE_PREFIX, key: string, value: number) {
    const cache = new Cache();
    await cache.instance.expire(`${prefix}:${key}`, value);
  }

  static async del(prefix: CACHE_PREFIX, key: string) {
    const cache = new Cache();
    await cache.instance.del(`${prefix}:${key}`);
  }

  static async get<T = unknown>(prefix: CACHE_PREFIX, key: string) {
    const cache = new Cache();
    const value = await cache.instance.get(`${prefix}:${key}`);

    if (!value) {
      return null;
    }

    if (typeof value === "string") {
      return JSON.parse(value) as T;
    }

    return value as T;
  }

  static async ttl(prefix: CACHE_PREFIX, key: string) {
    const cache = new Cache();
    return cache.instance.ttl(`${prefix}:${key}`);
  }

  static async quit() {
    const cache = new Cache();
    await cache.instance.quit();
  }
}
