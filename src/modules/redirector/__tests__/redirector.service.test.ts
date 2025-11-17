import { resolveRedirectDestination } from "../services";
import { REDIRECTOR_ERRORS_RESPONSE } from "../schemas";
import { mockGetRedirectLinkValuesResponse } from "@/modules/link/__mocks__/get-redirect-link";
import { mockGetLinkByHashFromCacheResponse } from "@/modules/link/__mocks__/get-by-hash";
import { Context } from "@/configurations/context";

const baseContext = { prisma: {} as never } as Context;

function createDependencies() {
  return {
    getLinkByHashFromCache: jest.fn(),
    getLinkByHashOrAlias: jest.fn(),
    saveOrUpdateLinkCache: jest.fn(),
  };
}

describe("modules/redirector.services", () => {

  it("should return redirect target from cache when entry is active", async () => {
    const identifier = "abcd1234";
    const dependencies = createDependencies();
    dependencies.getLinkByHashFromCache.mockResolvedValue({
      ...mockGetLinkByHashFromCacheResponse,
      active: true,
      validAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    });

    const result = await resolveRedirectDestination({
      identifier,
      context: baseContext,
    }, dependencies);

    expect(result).toEqual({
      redirectTo: mockGetLinkByHashFromCacheResponse.redirectTo,
    });
    expect(dependencies.getLinkByHashOrAlias).not.toHaveBeenCalled();
  });

  it("should throw when cached link is inactive or expired", async () => {
    const identifier = "abcd1234";
    const dependencies = createDependencies();
    dependencies.getLinkByHashFromCache.mockResolvedValue({
      ...mockGetLinkByHashFromCacheResponse,
      active: false,
    });

    await expect(
      resolveRedirectDestination({ identifier, context: baseContext }, dependencies)
    ).rejects.toThrow(REDIRECTOR_ERRORS_RESPONSE.LINK_NOT_FOUND);

    dependencies.getLinkByHashFromCache.mockResolvedValue({
      ...mockGetLinkByHashFromCacheResponse,
      active: true,
      validAt: new Date(Date.now() - 60 * 1000).toISOString(),
    });

    await expect(
      resolveRedirectDestination({ identifier, context: baseContext }, dependencies)
    ).rejects.toThrow(REDIRECTOR_ERRORS_RESPONSE.LINK_NOT_FOUND);
  });

  it("should fetch link from database and hydrate cache when cache miss occurs", async () => {
    const identifier = mockGetRedirectLinkValuesResponse.hash;
    const dependencies = createDependencies();
    dependencies.getLinkByHashFromCache.mockResolvedValue(null);
    dependencies.getLinkByHashOrAlias.mockResolvedValue([
      {
        ...mockGetRedirectLinkValuesResponse,
        active: true,
        validAt: new Date(Date.now() + 60 * 60 * 1000),
      },
    ]);

    const result = await resolveRedirectDestination({
      identifier,
      context: baseContext,
    }, dependencies);

    expect(result).toEqual({
      redirectTo: mockGetRedirectLinkValuesResponse.redirectTo,
    });
    expect(dependencies.saveOrUpdateLinkCache).toHaveBeenCalledWith(
      expect.objectContaining({
        hash: mockGetRedirectLinkValuesResponse.hash,
        alias: mockGetRedirectLinkValuesResponse.alias,
        id: mockGetRedirectLinkValuesResponse.id,
      })
    );
  });

  it("should throw when database does not return a link", async () => {
    const dependencies = createDependencies();
    dependencies.getLinkByHashFromCache.mockResolvedValue(null);
    dependencies.getLinkByHashOrAlias.mockResolvedValue([]);

    await expect(
      resolveRedirectDestination({
        identifier: "unknown",
        context: baseContext,
      }, dependencies)
    ).rejects.toThrow(REDIRECTOR_ERRORS_RESPONSE.LINK_NOT_FOUND);
  });

  it("should throw when database link is inactive or expired", async () => {
    const dependencies = createDependencies();
    dependencies.getLinkByHashFromCache.mockResolvedValue(null);
    dependencies.getLinkByHashOrAlias.mockResolvedValue([
      { ...mockGetRedirectLinkValuesResponse, active: false },
    ]);

    await expect(
      resolveRedirectDestination({
        identifier: mockGetRedirectLinkValuesResponse.hash,
        context: baseContext,
      }, dependencies)
    ).rejects.toThrow(REDIRECTOR_ERRORS_RESPONSE.LINK_NOT_FOUND);

    dependencies.getLinkByHashOrAlias.mockResolvedValue([
      {
        ...mockGetRedirectLinkValuesResponse,
        active: true,
        validAt: new Date(Date.now() - 60 * 1000),
      },
    ]);

    await expect(
      resolveRedirectDestination({
        identifier: mockGetRedirectLinkValuesResponse.hash,
        context: baseContext,
      }, dependencies)
    ).rejects.toThrow(REDIRECTOR_ERRORS_RESPONSE.LINK_NOT_FOUND);
  });

  it("should throw when identifier is empty", async () => {
    await expect(
      resolveRedirectDestination({ identifier: "   ", context: baseContext })
    ).rejects.toThrow(REDIRECTOR_ERRORS_RESPONSE.LINK_NOT_FOUND);
  });
});
