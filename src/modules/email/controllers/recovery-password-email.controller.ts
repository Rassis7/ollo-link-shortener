import { FastifyReply, FastifyRequest } from "fastify";
import { RecoveryPasswordEmailInput } from "../schemas";
import { ErrorHandler, HTTP_STATUS_CODE } from "@/helpers";
import { findUserByEmail } from "@/modules/user/services";
import { prisma } from "@/infra";
import { sendRecoveryPasswordEmail } from "../services";

export async function recoveryPasswordEmailHandler(
  request: FastifyRequest<{
    Body: RecoveryPasswordEmailInput;
  }>,
  reply: FastifyReply
) {
  try {
    const { email } = request.body;
    const user = await findUserByEmail({ email, context: { prisma } });

    if (user) {
      await sendRecoveryPasswordEmail({ email });
    }

    return reply.code(HTTP_STATUS_CODE.NO_CONTENT).send();
  } catch (e) {
    const error = new ErrorHandler(e);
    return reply.code(400).send(error);
  }
}
