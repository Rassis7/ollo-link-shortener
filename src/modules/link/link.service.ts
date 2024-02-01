import { Context } from "@/configurations/context";

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
