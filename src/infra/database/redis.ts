import IoRedis, { RedisOptions as IoRedisOptions } from "ioredis";

export enum CACHE_PREFIX {
  ACCOUNT_VERIFICATION_EMAIL = "accountVerificationEmail",
  LINK = "link",
  AUTH = "auth",
}

export interface RedisOptions {
  redisUrl: string;
  redisOptions?: IoRedisOptions;
}

export class Redis {
  private static instance: Redis | null = null;
  private readonly redisClient: IoRedis;

  constructor({ redisUrl, redisOptions }: RedisOptions) {
    this.redisClient = new IoRedis(redisUrl, redisOptions ?? {});
  }

  static getInstance(options: RedisOptions): Redis {
    if (!Redis.instance) {
      Redis.instance = new Redis(options);
    }
    return Redis.instance;
  }

  getClient() {
    return this.redisClient;
  }

  async set(
    prefix: CACHE_PREFIX,
    key: string,
    value: string | Record<string, unknown>,
    expireInSeconds?: number
  ): Promise<void> {
    const valueFormatted =
      typeof value !== "string" ? JSON.stringify(value) : value;

    await this.redisClient.set(`${prefix}:${key}`, valueFormatted);

    if (expireInSeconds) {
      await this.redisClient.expire(`${prefix}:${key}`, expireInSeconds);
    }
  }

  async expire(
    prefix: CACHE_PREFIX,
    key: string,
    value: number
  ): Promise<void> {
    await this.redisClient.expire(`${prefix}:${key}`, value);
  }

  async del(prefix: CACHE_PREFIX, key: string): Promise<void> {
    await this.redisClient.del(`${prefix}:${key}`);
  }

  async get<T = unknown>(prefix: CACHE_PREFIX, key: string): Promise<T | null> {
    try {
      const value = await this.redisClient.get(`${prefix}:${key}`);

      if (!value) {
        return null;
      }

      if (typeof value === "string" && !!value.match(/^(\{.*\}|\[.*\])$/)) {
        return JSON.parse(value) as T;
      }

      return value as T;
    } catch (error) {
      return null;
    }
  }

  async ttl(prefix: CACHE_PREFIX, key: string): Promise<number> {
    return this.redisClient.ttl(`${prefix}:${key}`);
  }

  async quit(): Promise<void> {
    await this.redisClient.quit();
  }
}
