import { Context } from "@/configurations/context";
import {
  EditLinkInput,
  GetAllLinksByUserInput,
  GetByLinkHashFromCacheResponse,
  LINK_ERRORS_RESPONSE,
  SaveLinkInput,
} from "../schemas";
import { expireCacheInSeconds } from "@/helpers";
import { CACHE_PREFIX, cache } from "@/infra";

export async function getAllLinksByUser({
  input,
  context,
}: {
  input: GetAllLinksByUserInput;
  context: Context;
}) {
  const { userId, ...restInput } = input;
  return context.prisma.link.findMany({
    where: { userId },
    select: {
      active: true,
      alias: true,
      hash: true,
      metadata: true,
      redirectTo: true,
      validAt: true,
      id: true,
    },
    ...restInput,
    orderBy: { createdAt: "desc" },
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

type SaveOrUpdateLinkCache = SaveLinkInput & {
  id?: string;
};

export async function saveOrUpdateLinkCache({
  hash,
  alias,
  userId: _,
  id,
  ...rest
}: SaveOrUpdateLinkCache) {
  const hasExistsLink = await getLinkByHashFromCache(hash);

  if (hasExistsLink && !id) {
    throw new Error(LINK_ERRORS_RESPONSE.URL_HAS_EXISTS);
  }

  const key = alias ?? hash;
  await cache.set(CACHE_PREFIX.LINK, key, rest);

  if (rest.validAt) {
    const validAt = expireCacheInSeconds(rest?.validAt);
    await cache.expire(CACHE_PREFIX.LINK, key, validAt);
  }
}
