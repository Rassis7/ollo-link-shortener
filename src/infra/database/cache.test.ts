import { faker } from "@faker-js/faker";
import { CACHE_PREFIX } from "./cache";
import { Redis as Cache } from "./redis";

describe("database/cache", () => {
  let cache: Cache;

  beforeEach(() => {
    cache = new Cache({ redisUrl: "" });
  });

  afterEach(() => {
    cache.quit();
    jest.restoreAllMocks();
  });

  it("Should be able to save a cache", async () => {
    jest.spyOn(cache.getClient(), "set");

    const value = { company: faker.company.name() };
    await cache.set(CACHE_PREFIX.LINK, "any_key", value);

    expect(cache.getClient().set).toHaveBeenCalledTimes(1);
    expect(cache.getClient().set).toHaveBeenCalledWith(
      `${CACHE_PREFIX.LINK}:any_key`,
      JSON.stringify(value)
    );
  });

  it("Should be able to save a cache with expire in", async () => {
    jest.spyOn(cache.getClient(), "set");
    jest.spyOn(cache.getClient(), "expire");

    await cache.set(CACHE_PREFIX.LINK, "any_key", "value", 60);

    expect(cache.getClient().expire).toHaveBeenCalledTimes(1);
    expect(cache.getClient().expire).toHaveBeenCalledWith(
      `${CACHE_PREFIX.LINK}:any_key`,
      60
    );
  });

  it("Should be able to return cache value like a object format", async () => {
    const payload = JSON.stringify({ company: faker.company.name() });
    jest.spyOn(cache.getClient(), "get").mockResolvedValue(payload);

    const response = await cache.get(CACHE_PREFIX.LINK, "any_key");

    expect(response).toEqual(JSON.parse(payload));
  });

  it("Should be able to return cache value like a normal value", async () => {
    const payload = faker.number.int();
    jest.spyOn(cache.getClient(), "get").mockResolvedValue(payload.toString());

    const response = await cache.get(CACHE_PREFIX.LINK, "any_key");

    expect(response).toEqual(payload.toString());
  });

  it("Should be able to return cache value like a nullable value", async () => {
    jest.spyOn(cache.getClient(), "get").mockResolvedValue(null);

    const response = await cache.get(CACHE_PREFIX.LINK, "any_key");

    expect(response).toEqual(null);
  });

  it("Should be able to return cache value like a nullable value if happen a exception", async () => {
    jest.spyOn(cache.getClient(), "get").mockRejectedValue(new Error());

    const response = await cache.get(CACHE_PREFIX.LINK, "any_key");

    expect(response).toEqual(null);
  });

  it("Should be able to delete a cache", async () => {
    jest.spyOn(cache.getClient(), "del");

    await cache.del(CACHE_PREFIX.LINK, "any_key");

    expect(cache.getClient().del).toHaveBeenCalledTimes(1);
    expect(cache.getClient().del).toHaveBeenCalledWith(
      `${CACHE_PREFIX.LINK}:any_key`
    );
  });

  it("Should be able to return time to live (TTL) of a key in cache", async () => {
    jest.spyOn(cache.getClient(), "ttl");

    const ttlInSeconds = 60;

    await cache.set(CACHE_PREFIX.LINK, "any_key", "any_value", ttlInSeconds);

    const ttl = await cache.ttl(CACHE_PREFIX.LINK, "any_key");

    expect(cache.getClient().ttl).toHaveBeenCalledWith(
      `${CACHE_PREFIX.LINK}:any_key`
    );

    expect(ttl).toBe(ttlInSeconds);
  });

  it("Should be able to call quit method", async () => {
    jest.spyOn(cache.getClient(), "quit");
    await cache.quit();
    expect(cache.getClient().quit).toHaveBeenCalledTimes(1);
  });
});
