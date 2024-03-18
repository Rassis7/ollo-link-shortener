import { FastifyReply, FastifyRequest } from "fastify";
import {
  VERIFY_EMAIL_RESPONSE,
  VerifyEmailInput,
  VerifyEmailParams,
} from "../schemas";
import { sendVerifyEmailHandler, verifyEmail } from "../services";
import { ErrorHandler, HTTP_STATUS_CODE } from "@/helpers";
import { prisma } from "@/infra";
import { findUserByEmail } from "@/modules/user/services";

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
    const user = await findUserByEmail({ email, context: { prisma } });

    if (!user?.id) {
      throw new Error(VERIFY_EMAIL_RESPONSE.CODE_EXPIRED_OR_NOT_EXISTS);
    }

    if (!user?.accountConfirmed) {
      await verifyEmail({
        code: verificationCode,
        email,
        sessionHash: user.id,
        context: { prisma },
      });
    }

    return reply.code(HTTP_STATUS_CODE.NO_CONTENT).send();
  } catch (error) {
    const e = new ErrorHandler(error);
    return reply.code(HTTP_STATUS_CODE.BAD_REQUEST).send(e);
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
