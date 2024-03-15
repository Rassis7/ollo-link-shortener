import { mockGetAllLinksResponse } from "../__mocks__/get-all";
import { faker } from "@faker-js/faker";
import {
  getAllLinksByUser,
  getLinkByHashFromCache,
  getLinkByHashOrAlias,
  saveOrUpdateLinkCache,
  updateLink,
} from "../link.service";
import { mockContext, context, cache } from "@/tests";
import { expireCacheInSeconds } from "@/helpers";
import {
  mockGetLinkByAliasInput,
  mockGetLinkByAliasOrHashResponse,
} from "../__mocks__/get-by-alias-or-hash";
import {
  mockGetLinkByHashFromCacheResponse,
  mockHashInput,
} from "../__mocks__/get-by-hash";
import {
  mockEditLinkInput,
  mockEditLinkResponse,
} from "../__mocks__/edit-link";
import { mockSaveLinkInput } from "@/modules/shortener/__mocks__/save-link";
import { CACHE_PREFIX } from "@/infra";

describe("modules/link-unit", () => {
  it("Should be able to return all links to specif user", async () => {
    mockContext.prisma.link.findMany.mockResolvedValue(mockGetAllLinksResponse);

    const userId = faker.string.uuid();
    const links = await getAllLinksByUser({
      input: { userId },
      context: mockContext,
    });

    expect(mockContext.prisma.link.findMany).toHaveBeenCalledTimes(1);
    expect(mockContext.prisma.link.findMany).toHaveBeenCalledWith({
      where: {
        userId,
      },
      select: {
        active: true,
        alias: true,
        hash: true,
        metadata: true,
        redirectTo: true,
        validAt: true,
      },
    });
    expect(links).toEqual(mockGetAllLinksResponse);
  });

  it("Should be able to return link by alias or hash", async () => {
    mockContext.prisma.link.findMany.mockResolvedValue(
      mockGetLinkByAliasOrHashResponse
    );

    const link = await getLinkByHashOrAlias({
      input: mockGetLinkByAliasInput,
      context,
    });

    expect(mockContext.prisma.link.findMany).toHaveBeenCalledTimes(1);
    expect(mockContext.prisma.link.findMany).toHaveBeenCalledWith({
      where: {
        OR: [
          {
            hash: mockGetLinkByAliasInput.hash,
          },
          {
            alias: mockGetLinkByAliasInput.alias,
          },
        ],
      },
    });

    expect(link).toEqual(mockGetLinkByAliasOrHashResponse);
  });

  it("Should be able to return link by hash and without alias", async () => {
    mockContext.prisma.link.findMany.mockResolvedValue(
      mockGetLinkByAliasOrHashResponse
    );

    await getLinkByHashOrAlias({
      input: { hash: mockGetLinkByAliasInput.hash },
      context,
    });

    expect(mockContext.prisma.link.findMany).toHaveBeenCalledTimes(1);
    expect(mockContext.prisma.link.findMany).toHaveBeenCalledWith({
      where: {
        hash: mockGetLinkByAliasInput.hash,
      },
    });
  });

  it("Should be able to return link by hash from cache", async () => {
    jest
      .spyOn(cache, "get")
      .mockResolvedValue(mockGetLinkByHashFromCacheResponse);

    const linkFromCache = await getLinkByHashFromCache(mockHashInput);

    expect(cache.get).toHaveBeenCalledTimes(1);
    expect(cache.get).toHaveBeenCalledWith(CACHE_PREFIX.LINK, mockHashInput);

    expect(linkFromCache).toEqual(mockGetLinkByHashFromCacheResponse);
  });

  it("Should be able to return null if not exists link by hash in cache", async () => {
    jest.spyOn(cache, "get").mockResolvedValue(null);

    const linkFromCache = await getLinkByHashFromCache(mockHashInput);

    expect(cache.get).toHaveBeenCalledTimes(1);
    expect(cache.get).toHaveBeenCalledWith(CACHE_PREFIX.LINK, mockHashInput);

    expect(linkFromCache).toEqual(null);
  });

  it("Should be able to response error if exists link when create link in cache", async () => {
    jest
      .spyOn(cache, "get")
      .mockResolvedValue(JSON.stringify(mockGetLinkByHashFromCacheResponse));

    expect(async () =>
      saveOrUpdateLinkCache(mockSaveLinkInput)
    ).rejects.toThrow(/a url informada já existe/i);
  });

  it("Should be able to create link in cache and save key as alias", async () => {
    jest.spyOn(cache, "get").mockResolvedValue(null);
    jest.spyOn(cache, "set");
    jest.spyOn(cache, "expire");

    await saveOrUpdateLinkCache(mockSaveLinkInput);

    const {
      alias,
      hash: _hash,
      userId: _userId,
      ...CacheSettableParams
    } = mockSaveLinkInput;

    expect(cache.set).toHaveBeenCalledTimes(1);
    expect(cache.set).toHaveBeenCalledWith(
      CACHE_PREFIX.LINK,
      alias,
      CacheSettableParams
    );
    expect(cache.expire).toHaveBeenCalledTimes(1);

    const validAt = expireCacheInSeconds(mockSaveLinkInput.validAt!);
    expect(cache.expire).toHaveBeenCalledWith(
      CACHE_PREFIX.LINK,
      alias,
      validAt
    );
  });

  it("Should be able to create link in cache and save key as hash", async () => {
    jest.spyOn(cache, "get").mockResolvedValue(null);
    jest.spyOn(cache, "set");

    const { alias: _alias, hash, ...CacheSettableParams } = mockSaveLinkInput;

    await saveOrUpdateLinkCache({ hash, ...CacheSettableParams });

    expect(cache.set).toHaveBeenCalledTimes(1);

    const { userId: _userId, ...CacheResponse } = CacheSettableParams;
    expect(cache.set).toHaveBeenCalledWith(
      CACHE_PREFIX.LINK,
      hash,
      CacheResponse
    );
  });

  it("Should be able to edit an existing link", async () => {
    mockContext.prisma.link.update.mockResolvedValue(mockEditLinkResponse);

    const response = await updateLink({
      data: mockEditLinkInput,
      context,
    });

    expect(mockContext.prisma.link.update).toHaveBeenCalledTimes(1);

    const { id, ...restMockEditLinkInput } = mockEditLinkInput;
    expect(mockContext.prisma.link.update).toHaveBeenCalledWith({
      data: restMockEditLinkInput,
      where: { id },
    });

    expect(response).toEqual(mockEditLinkResponse);
  });
});
