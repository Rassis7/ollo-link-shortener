import { faker } from "@faker-js/faker";
import {
  generateUrlHash,
  getLinkByHashFromCache,
  getLinkByHashOrAlias,
  getRedirectLinkValues,
} from "./shortener.service";
import { createHash } from "node:crypto";
import { mockContext, context, redis } from "@/tests";
import {
  mockGetRedirectLinkValuesResponse,
  mockGetRedirectValuesInput,
} from "./__mocks__/get-redirect-link";
import {
  mockGetLinkByAliasInput,
  mockGetLinkByAliasResponse,
} from "./__mocks__/get-by-alias";
import {
  mockGetLinkByHashFromCacheResponse,
  mockHashInput,
  mockGetLinkByHashResponse,
} from "./__mocks__/get-by-hash";

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
      mockGetLinkByAliasResponse
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

    expect(link).toEqual(mockGetLinkByAliasResponse);
  });

  it("Should be able to return link by hash and without alias", async () => {
    mockContext.prisma.link.findMany.mockResolvedValue(
      mockGetLinkByAliasResponse
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

  it("Should be able to create link cache", () => {});
  it.todo("Should be able to create link");
});
