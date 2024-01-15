import { createHash } from "node:crypto";
import {
  GetByHashResponse,
  SHORTENER_ERRORS_RESPONSE,
  SaveLinkInput,
} from "./shortener.schema";
import { Context } from "@/configurations/context";
import { redis } from "@/infra";

type GetRedirectLinkValuesInput = {
  redirectTo: string;
  alias?: string;
};

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
    where: {
      ...input,
      userId: 123,
    },
  });
}

export async function getByAlias({
  alias,
  context,
}: {
  alias: string;
  context: Context;
}) {
  return context.prisma.link.findFirst({
    where: {
      alias,
    },
  });
}

async function getByHash(hash: string): Promise<GetByHashResponse | null> {
  const linkResponse = await redis.get(hash);

  if (!linkResponse) {
    return null;
  }

  if (typeof linkResponse === "string") {
    return JSON.parse(linkResponse);
  }

  return linkResponse;
}

export async function saveLinkCache({ hash, ...rest }: SaveLinkInput) {
  const hasExistsLink = await getByHash(hash);

  if (hasExistsLink) {
    throw new Error(SHORTENER_ERRORS_RESPONSE.URL_HAS_EXISTS);
  }

  await redis.set(hash, JSON.stringify({ ...rest }));
}

export async function saveLink({
  context,
  data,
}: {
  data: SaveLinkInput;
  context: Context;
}) {
  const link = await getRedirectLinkValues({
    context,
    input: { redirectTo: data.redirectTo, alias: data.alias },
  });

  if (link) {
    await saveLink({ context, data });
  }

  await context.prisma.link.create({ data });

  return data.hash;
}
