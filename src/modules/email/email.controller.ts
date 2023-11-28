import { FastifyReply, FastifyRequest } from "fastify";
import {
  VERIFY_EMAIL_RESPONSE,
  VerifyEmailInput,
  VerifyEmailParams,
} from "./email.schema";
import { sendVerifyEmailHandler, verifyEmail } from "./email.service";

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

    return reply.code(200).send();
  } catch (error) {
    const statusCode = VERIFY_EMAIL_RESPONSE.CODE_EXPIRED_OR_NOT_EXISTS
      ? 401
      : 400;

    return reply.code(statusCode).send(error);
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

    return reply.code(200).send();
  } catch (error) {
    return reply.code(400).send("Ocorreu um erro ao reenviar o email");
  }
}
