import Redis from "ioredis";

export enum PREFIX_ENUM {
  LINK_REFIX = "link:",
  AUTH_REFIX = "auth:",
}

type PrefixType = keyof typeof PREFIX_ENUM;

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
    prefix: PrefixType,
    key: string,
    value: string | Record<string, unknown>
  ) {
    const cache = new Cache();

    const valueFormatted =
      typeof value !== "string" ? JSON.stringify(value) : value;

    await cache.instance.set(prefix + key, valueFormatted);
  }

  static async expire(prefix: PrefixType, key: string, value: number) {
    const cache = new Cache();
    await cache.instance.expire(prefix + key, value);
  }

  static async del(prefix: PrefixType, key: string) {
    const cache = new Cache();
    await cache.instance.del(prefix + key);
  }

  static async get(prefix: PrefixType, key: string) {
    const cache = new Cache();
    return cache.instance.get(prefix + key);
  }

  static async ttl(prefix: PrefixType, key: string) {
    const cache = new Cache();
    return cache.instance.ttl(prefix + key);
  }

  static async quit() {
    const cache = new Cache();
    await cache.instance.quit();
  }
}
