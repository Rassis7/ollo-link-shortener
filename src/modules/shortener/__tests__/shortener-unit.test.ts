import { faker } from "@faker-js/faker";
import {
  generateUrlHash,
  getLinkByHashFromCache,
  getLinkByHashOrAlias,
  getRedirectLinkValues,
  shortenerLink,
  saveOrUpdateLinkCache,
  updateLink,
} from "../shortener.service";
import { createHash } from "node:crypto";
import { mockContext, context, redis } from "@/tests";
import {
  mockGetRedirectLinkValuesResponse,
  mockGetRedirectValuesInput,
} from "../__mocks__/get-redirect-link";
import {
  mockGetLinkByAliasInput,
  mockGetLinkByAliasOrHashResponse,
} from "../__mocks__/get-by-alias-or-hash";
import {
  mockGetLinkByHashFromCacheResponse,
  mockHashInput,
} from "../__mocks__/get-by-hash";
import {
  mockSaveLinkInput,
  mockSaveLinkResponse,
} from "../__mocks__/save-link";
import { expireCacheInSeconds } from "@/helpers";
import {
  mockEditLinkResponse,
  mockEditLinkInput,
} from "../__mocks__/edit-link";

describe("modules/shortener.unit", () => {
  it("Should be able to generate hash", async () => {
    (createHash as jest.Mock).mockReturnValue({
      update: jest.fn().mockReturnThis(),
      digest: jest.fn().mockReturnValue(Buffer.from("0123456789", "hex")),
    });

    const url = faker.internet.url();
    const hash = generateUrlHash(url);

    expect(hash).toEqual("01234567");
  });

  it("Should be able to return redirect link values", async () => {
    mockContext.prisma.link.findFirst.mockResolvedValue(
      mockGetRedirectLinkValuesResponse
    );

    const linkValues = await getRedirectLinkValues({
      input: mockGetRedirectValuesInput,
      context,
    });

    expect(mockContext.prisma.link.findFirst).toHaveBeenCalledTimes(1);

    expect(mockContext.prisma.link.findFirst).toHaveBeenCalledWith({
      where: mockGetRedirectValuesInput,
    });

    expect(linkValues).toEqual(mockGetRedirectLinkValuesResponse);
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
      .spyOn(redis, "get")
      .mockResolvedValue(JSON.stringify(mockGetLinkByHashFromCacheResponse));

    const linkFromCache = await getLinkByHashFromCache(mockHashInput);

    expect(redis.get).toHaveBeenCalledTimes(1);
    expect(redis.get).toHaveBeenCalledWith(mockHashInput);

    expect(linkFromCache).toEqual(mockGetLinkByHashFromCacheResponse);
  });

  it("Should be able to return null if not exists link by hash in cache", async () => {
    jest.spyOn(redis, "get").mockResolvedValue(null);

    const linkFromCache = await getLinkByHashFromCache(mockHashInput);

    expect(redis.get).toHaveBeenCalledTimes(1);
    expect(redis.get).toHaveBeenCalledWith(mockHashInput);

    expect(linkFromCache).toEqual(null);
  });

  it("Should be able to response error if exists link when create link in cache", async () => {
    jest
      .spyOn(redis, "get")
      .mockResolvedValue(JSON.stringify(mockGetLinkByHashFromCacheResponse));

    expect(async () =>
      saveOrUpdateLinkCache(mockSaveLinkInput)
    ).rejects.toThrow(/a url informada já existe/i);
  });

  it("Should be able to create link in cache and save key as alias", async () => {
    jest.spyOn(redis, "get").mockResolvedValue(null);
    jest.spyOn(redis, "set");
    jest.spyOn(redis, "expire");

    await saveOrUpdateLinkCache(mockSaveLinkInput);

    const {
      alias,
      hash: _hash,
      userId: _userId,
      ...redisSettableParams
    } = mockSaveLinkInput;

    expect(redis.set).toHaveBeenCalledTimes(1);
    expect(redis.set).toHaveBeenCalledWith(
      alias,
      JSON.stringify(redisSettableParams)
    );
    expect(redis.expire).toHaveBeenCalledTimes(1);

    const validAt = expireCacheInSeconds(mockSaveLinkInput.validAt!);
    expect(redis.expire).toHaveBeenCalledWith(alias, validAt);
  });

  it("Should be able to create link in cache and save key as hash", async () => {
    jest.spyOn(redis, "get").mockResolvedValue(null);
    jest.spyOn(redis, "set");

    const { alias: _alias, hash, ...redisSettableParams } = mockSaveLinkInput;

    await saveOrUpdateLinkCache({ hash, ...redisSettableParams });

    expect(redis.set).toHaveBeenCalledTimes(1);

    const { userId: _userId, ...redisResponse } = redisSettableParams;
    expect(redis.set).toHaveBeenCalledWith(hash, JSON.stringify(redisResponse));
  });

  it("Should be able to create link", async () => {
    mockContext.prisma.link.create.mockResolvedValue(mockSaveLinkResponse);

    const newLink = await shortenerLink({
      data: mockSaveLinkInput,
      context,
    });

    expect(mockContext.prisma.link.create).toHaveBeenCalledTimes(1);
    expect(mockContext.prisma.link.create).toHaveBeenCalledWith({
      data: { ...mockSaveLinkInput },
    });

    expect(newLink).toEqual(mockSaveLinkResponse);
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
