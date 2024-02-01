import { createHash } from "node:crypto";
import { GetRedirectLinkValuesInput, SaveLinkInput } from "./shortener.schema";
import { Context } from "@/configurations/context";

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

export async function shortenerLink({
  context,
  data,
}: {
  data: SaveLinkInput;
  context: Context;
}) {
  return await context.prisma.link.create({ data });
}
