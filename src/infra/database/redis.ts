import IoRedis, {
  // Redis as MockRedis,
  RedisOptions as IoRedisOptions,
} from "ioredis";

export enum CACHE_PREFIX {
  LINK = "link",
  AUTH = "auth",
}

export interface RedisOptions {
  redisUrl: string;
  redisInstance?: IoRedis;
  redisOptions?: IoRedisOptions;
}

export class Redis {
  private static instance: Redis | null = null;
  private readonly redisClient: IoRedis;

  constructor({ redisInstance, redisUrl, redisOptions }: RedisOptions) {
    this.redisClient =
      redisInstance ?? new IoRedis(redisUrl, redisOptions ?? {});
  }

  public static getInstance(options: RedisOptions): Redis {
    if (!Redis.instance) {
      Redis.instance = new Redis(options);
    }
    return Redis.instance;
  }

  public async set(
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

  public async expire(
    prefix: CACHE_PREFIX,
    key: string,
    value: number
  ): Promise<void> {
    await this.redisClient.expire(`${prefix}:${key}`, value);
  }

  public async del(prefix: CACHE_PREFIX, key: string): Promise<void> {
    await this.redisClient.del(`${prefix}:${key}`);
  }

  public async get<T = unknown>(
    prefix: CACHE_PREFIX,
    key: string
  ): Promise<T | null> {
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

  public async ttl(prefix: CACHE_PREFIX, key: string): Promise<number> {
    return this.redisClient.ttl(`${prefix}:${key}`);
  }

  public async quit(): Promise<void> {
    await this.redisClient.quit();
  }
}
