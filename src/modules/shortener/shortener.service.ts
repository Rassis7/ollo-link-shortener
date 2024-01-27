import { createHash } from "node:crypto";
import {
  EditLinkInput,
  GetByLinkHashFromCacheResponse,
  GetRedirectLinkValuesInput,
  SHORTENER_ERRORS_RESPONSE,
  SaveLinkInput,
} from "./shortener.schema";
import { Context } from "@/configurations/context";
import { redis } from "@/infra";
import { expireCacheInSeconds } from "@/helpers";

export function generateUrlHash(url: string): string {
  const data = url + Math.random().toString(36).slice(2, 5);
  const sha256 = createHash("sha256");
  const hashBuffer = sha256.update(data, "utf-8").digest();
  const hashString = hashBuffer.toString("hex").slice(0, 8);

  return hashString;
}

export async function getRedirectLinkValues({
  context,
  input,
}: {
  input: GetRedirectLinkValuesInput;
  context: Context;
}) {
  return context.prisma.link.findFirst({
    where: { ...input },
  });
}

export async function getLinkByHashOrAlias({
  input,
  context,
}: {
  input: { hash: string; alias?: string };
  context: Context;
}) {
  const whereCondition = input?.alias
    ? { OR: [{ hash: input.hash }, { alias: input.alias }] }
    : { hash: input.hash };

  return await context.prisma.link.findMany({
    where: whereCondition,
  });
}

export async function getLinkByHashFromCache(
  hash: string
): Promise<GetByLinkHashFromCacheResponse | null> {
  const linkResponse = await redis.get(hash);

  if (!linkResponse) {
    return null;
  }

  if (typeof linkResponse === "string") {
    return JSON.parse(linkResponse);
  }

  return linkResponse;
}

export async function saveOrUpdateLinkCache({
  hash,
  alias,
  userId: _userId,
  ...rest
}: SaveLinkInput) {
  const hasExistsLink = await getLinkByHashFromCache(hash);

  if (hasExistsLink) {
    throw new Error(SHORTENER_ERRORS_RESPONSE.URL_HAS_EXISTS);
  }

  const key = alias ?? hash;
  await redis.set(key, JSON.stringify({ ...rest }));

  if (rest.validAt) {
    const validAt = expireCacheInSeconds(rest?.validAt);
    await redis.expire(key, validAt);
  }
}

export async function shortenerLink({
  context,
  data,
}: {
  data: SaveLinkInput;
  context: Context;
}) {
  return await context.prisma.link.create({ data });
}

export async function updateLink({
  context,
  data,
}: {
  data: EditLinkInput;
  context: Context;
}) {
  const { id, ...params } = data;

  return await context.prisma.link.update({
    where: { id },
    data: params,
  });
}
