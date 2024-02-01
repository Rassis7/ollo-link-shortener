import { ErrorHandler } from "@/helpers";
import { FastifyReply, FastifyRequest } from "fastify";
import { JwtAuthProps } from "../auth/auth.schema";
import { prisma } from "@/infra";
import { getAllLinksByUser } from "./link.service";

export async function getAllLinksHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const user = await request.jwtDecode<JwtAuthProps>();

    const links = await getAllLinksByUser({
      input: { userId: user.id },
      context: { prisma },
    });

    return reply.code(200).send(links ?? []);
  } catch (e) {
    const error = new ErrorHandler(e);
    return reply.code(400).send(error);
  }
}
