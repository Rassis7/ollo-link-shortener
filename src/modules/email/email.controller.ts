import { FastifyReply, FastifyRequest } from "fastify";
import { VerifyEmailInput, VerifyEmailParams } from "./email.schema";
import { sendVerifyEmailHandler, verifyEmail } from "./email.service";
import { ErrorHandler } from "@/helpers";

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

    return reply.code(204).send();
  } catch (error) {
    const e = new ErrorHandler(error);
    return reply.code(401).send(e);
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
    const e = new ErrorHandler(error);
    return reply.code(400).send(e);
  }
}
