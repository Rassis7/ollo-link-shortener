import { FastifyReply, FastifyRequest } from "fastify";
import { VerifyEmailInput, VerifyEmailParams } from "../schemas";
import { sendVerifyEmailHandler, verifyEmail } from "../services";
import { ErrorHandler, HTTP_STATUS_CODE } from "@/helpers";

export async function verifyEmailHandler(
  request: FastifyRequest<{
    Params: VerifyEmailParams;
    Body: VerifyEmailInput;
  }>,
  reply: FastifyReply
) {
  try {
    const { verificationCode } = request.params;
    const { email } = request.body;

    await verifyEmail(verificationCode, email);

    return reply.code(HTTP_STATUS_CODE.NO_CONTENT).send();
  } catch (error) {
    const e = new ErrorHandler(error);
    return reply.code(HTTP_STATUS_CODE.UNAUTHORIZED).send(e);
  }
}

export async function resendVerificationEmailHandler(
  request: FastifyRequest<{
    Body: VerifyEmailInput;
  }>,
  reply: FastifyReply
) {
  try {
    const { email } = request.body;
    await sendVerifyEmailHandler(email);

    return reply.code(HTTP_STATUS_CODE.OK).send();
  } catch (error) {
    const e = new ErrorHandler(error);
    return reply.code(HTTP_STATUS_CODE.BAD_REQUEST).send(e);
  }
}
