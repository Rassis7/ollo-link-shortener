import { Context } from "@/configurations/context";
import {
  EditLinkInput,
  GetByLinkHashFromCacheResponse,
  LINK_ERRORS_RESPONSE,
} from "./link.schema";
import { expireCacheInSeconds } from "@/helpers";
import { CACHE_PREFIX, cache } from "@/infra";
import { SaveLinkInput } from "../shortener/shortener.schema";

export async function getAllLinksByUser({
  input,
  context,
}: {
  input: { userId: string };
  context: Context;
}) {
  return context.prisma.link.findMany({
    where: {
      userId: input.userId,
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

export async function getLinkByHashFromCache(
  hash: string
): Promise<GetByLinkHashFromCacheResponse | null> {
  return cache.get(CACHE_PREFIX.LINK, hash);
}

export async function saveOrUpdateLinkCache({
  hash,
  alias,
  userId: _userId,
  ...rest
}: SaveLinkInput) {
  const hasExistsLink = await getLinkByHashFromCache(hash);

  if (hasExistsLink) {
    throw new Error(LINK_ERRORS_RESPONSE.URL_HAS_EXISTS);
  }

  const key = alias ?? hash;
  await cache.set(CACHE_PREFIX.LINK, key, rest);

  if (rest.validAt) {
    const validAt = expireCacheInSeconds(rest?.validAt);
    await cache.expire(CACHE_PREFIX.LINK, key, validAt);
  }
}
