import { FastifyReply, FastifyRequest } from "fastify";

import { ErrorHandler, HTTP_STATUS_CODE } from "@/helpers";
import { ChangePasswordInput } from "../schemas";

import {
  changePassword,
  getChangePasswordRequestEmail,
  handleInvalidChangePasswordLink,
} from "../services";
import { prisma } from "@/infra";

type ChangePasswordRequestProps = FastifyRequest<{
  Body: ChangePasswordInput;
}>;
export async function changePasswordHandler(
  request: ChangePasswordRequestProps,
  reply: FastifyReply
) {
  try {
    const { body } = request;

    const email = await getChangePasswordRequestEmail(body.linkId);

    await changePassword({
      email,
      newPassword: body.password,
      context: { prisma },
    });

    await handleInvalidChangePasswordLink(body.linkId);

    return reply.code(HTTP_STATUS_CODE.NO_CONTENT).send();
  } catch (e) {
    const error = new ErrorHandler(e);
    return reply.code(HTTP_STATUS_CODE.BAD_REQUEST).send(error);
  }
}
