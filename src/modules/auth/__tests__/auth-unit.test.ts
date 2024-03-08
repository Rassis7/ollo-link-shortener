import { CACHE_PREFIX, cache } from "@/infra";
import { generateSession, getSession } from "../auth.service";
import { faker } from "@faker-js/faker";
import { mockGenerationSessionInput } from "../__mocks__/auth";

const hash = faker.string.sample(5);

describe("modules/auth-unit", () => {
  it("Should be able to return correct session values", async () => {
    jest.spyOn(cache, "ttl").mockReturnValue(Promise.resolve(60));
    jest.spyOn(cache, "get");

    await getSession(hash);

    expect(cache.get).toHaveBeenCalledTimes(1);
    expect(cache.get).toHaveBeenCalledWith(CACHE_PREFIX.AUTH, hash);
  });

  it("Should be able to return null if session was expired", async () => {
    jest.spyOn(cache, "ttl").mockReturnValue(Promise.resolve(0));
    jest.spyOn(cache, "get");

    const session = await getSession(hash);

    expect(session).toBeNull();
  });
  it("Should be able to generate session with success", async () => {
    jest.spyOn(cache, "set");

    await generateSession(mockGenerationSessionInput);

    expect(cache.set).toHaveBeenCalledWith(
      CACHE_PREFIX.AUTH,
      mockGenerationSessionInput.id,
      { enabled: true, ...mockGenerationSessionInput },
      process.env.REDIS_TOKEN_EXPIRE_IN
    );
  });
  it("Should not be able to call create session if session existis", async () => {
    jest.spyOn(cache, "set");
    jest.spyOn(cache, "get").mockReturnValue(Promise.resolve("anything"));

    await generateSession(mockGenerationSessionInput);

    expect(cache.set).not.toHaveBeenCalled();
  });
});
