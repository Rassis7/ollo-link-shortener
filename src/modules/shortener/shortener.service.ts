import { createHash } from "node:crypto";
import {
  GetByLinkHashFromCacheResponse,
  GetRedirectLinkValuesInput,
  SHORTENER_ERRORS_RESPONSE,
  SaveLinkInput,
} from "./shortener.schema";
import { Context } from "@/configurations/context";
import { redis } from "@/infra";

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

export async function saveLinkCache({ hash, alias, ...rest }: SaveLinkInput) {
  const hasExistsLink = await getLinkByHashFromCache(hash);

  if (hasExistsLink) {
    throw new Error(SHORTENER_ERRORS_RESPONSE.URL_HAS_EXISTS);
  }

  const key = alias ?? hash;
  await redis.set(key, JSON.stringify({ ...rest }));
}

export async function saveLink({
  context,
  data,
}: {
  data: SaveLinkInput;
  context: Context;
}) {
  return await context.prisma.link.create({ data });
}
