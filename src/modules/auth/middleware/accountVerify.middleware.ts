import { ErrorHandler } from "@/helpers";
import { FastifyReply, FastifyRequest } from "fastify";

export async function accountVerifyHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
  } catch (e) {
    const error = new ErrorHandler(e);
    return reply.code(400).send(error);
  }
}
