import { ErrorHandler, HTTP_STATUS_CODE } from "@/helpers";
import { FastifyReply, FastifyRequest } from "fastify";
import { ACCOUNT_VERIFY_ERRORS } from "../schemas";

export async function accountVerifyHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const { accountConfirmed } = request.user;

    if (!accountConfirmed) {
      throw new Error(ACCOUNT_VERIFY_ERRORS.NOT_CONFIRMED);
    }
  } catch (e) {
    const error = new ErrorHandler(e);
    return reply.code(HTTP_STATUS_CODE.FORBIDDEN).send(error);
  }
}
