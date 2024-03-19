import { CACHE_PREFIX, cache } from "@/infra";
import { faker } from "@faker-js/faker";
import { generateSession, getSession, updateSession } from "../services";
import { mockGenerationSessionInput, mockSession } from "../__mocks__/session";
import * as sessionService from "../services/session.service";

const hash = faker.string.sample(5);

describe("modules/session-unit", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

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

  it("Should be able to update session", async () => {
    jest.spyOn(cache, "ttl").mockReturnValue(Promise.resolve(60));
    jest.spyOn(cache, "get").mockResolvedValue(mockSession);
    jest.spyOn(cache, "set");

    const newSession = await updateSession(mockSession.id, {
      accountConfirmed: true,
    });

    expect(cache.set).toHaveBeenCalledWith(
      CACHE_PREFIX.AUTH,
      mockSession.id,
      {
        ...mockSession,
        accountConfirmed: true,
      },
      "43200"
    );
    expect(newSession).toEqual({ ...mockSession, accountConfirmed: true });
  });

  it("Should not be able to update session if not exists session", async () => {
    jest.spyOn(sessionService, "getSession").mockResolvedValue(null);
    jest.spyOn(cache, "set");

    const newSession = await updateSession(hash, { accountConfirmed: true });

    expect(cache.set).not.toHaveBeenCalled();
    expect(newSession).toBeNull();
  });
});
