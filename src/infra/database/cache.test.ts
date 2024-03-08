import { faker } from "@faker-js/faker";
import { CACHE_PREFIX } from "./cache";
import { Redis as Cache } from "./redis";
import IORedisMock from "ioredis-mock";

const redisClientMock = new IORedisMock();

describe("database/cache", () => {
  let cache: Cache;

  beforeEach(() => {
    cache = new Cache({ redisInstance: redisClientMock, redisUrl: "" });
  });

  afterEach(() => {
    cache.quit();
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it("Should be able to save a cache", async () => {
    jest.spyOn(redisClientMock, "set");

    const value = { company: faker.company.name() };
    await cache.set(CACHE_PREFIX.AUTH, "any_key", value);

    expect(redisClientMock.set).toHaveBeenCalledTimes(1);
    expect(redisClientMock.set).toHaveBeenCalledWith(
      `${CACHE_PREFIX.AUTH}:any_key`,
      JSON.stringify(value)
    );
  });

  it("Should be able to save a cache with expire in", async () => {
    jest.spyOn(redisClientMock, "set");
    jest.spyOn(redisClientMock, "expire");

    await cache.set(CACHE_PREFIX.LINK, "any_key", "value", 60);

    expect(redisClientMock.expire).toHaveBeenCalledTimes(1);
    expect(redisClientMock.expire).toHaveBeenCalledWith(
      `${CACHE_PREFIX.LINK}:any_key`,
      60
    );
  });

  it("Should be able to return cache value like a object format", async () => {
    const payload = JSON.stringify({ company: faker.company.name() });
    jest.spyOn(redisClientMock, "get").mockResolvedValue(payload);

    const response = await cache.get(CACHE_PREFIX.AUTH, "any_key");

    expect(response).toEqual(JSON.parse(payload));
  });

  it("Should be able to return cache value like a normal value", async () => {
    const payload = faker.number.int();
    jest.spyOn(redisClientMock, "get").mockResolvedValue(payload.toString());

    const response = await cache.get(CACHE_PREFIX.AUTH, "any_key");

    expect(response).toEqual(payload.toString());
  });

  it("Should be able to return cache value like a nullable value", async () => {
    jest.spyOn(redisClientMock, "get").mockResolvedValue(null);

    const response = await cache.get(CACHE_PREFIX.AUTH, "any_key");

    expect(response).toEqual(null);
  });

  it("Should be able to return cache value like a nullable value if happen a exception", async () => {
    jest.spyOn(redisClientMock, "get").mockRejectedValue(new Error());

    const response = await cache.get(CACHE_PREFIX.AUTH, "any_key");

    expect(response).toEqual(null);
  });

  it("Should be able to delete a cache", async () => {
    jest.spyOn(redisClientMock, "del");

    await cache.del(CACHE_PREFIX.AUTH, "any_key");

    expect(redisClientMock.del).toHaveBeenCalledTimes(1);
    expect(redisClientMock.del).toHaveBeenCalledWith(
      `${CACHE_PREFIX.AUTH}:any_key`
    );
  });

  it("Should be able to return time to live (TTL) of a key in cache", async () => {
    jest.spyOn(redisClientMock, "ttl");

    const ttlInSeconds = 60;

    await cache.set(CACHE_PREFIX.LINK, "any_key", "any_value", ttlInSeconds);

    const ttl = await cache.ttl(CACHE_PREFIX.LINK, "any_key");

    expect(redisClientMock.ttl).toHaveBeenCalledWith(
      `${CACHE_PREFIX.LINK}:any_key`
    );

    expect(ttl).toBe(ttlInSeconds);
  });
});
