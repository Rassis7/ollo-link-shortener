import { FastifyReply, FastifyRequest } from "fastify";
import { createUser, findUserByEmail } from "../services/user.service";
import { CreateUserInput, USER_ERRORS_RESPONSE } from "../schemas/user.schema";
import { sendVerifyEmailHandler } from "../../email/services/account-verification-email.service";
import { ErrorHandler, HTTP_STATUS_CODE } from "@/helpers";
import { prisma } from "@/infra";

type RegisterUserHandlerRequestProps = FastifyRequest<{
  Body: CreateUserInput;
}>;

export async function registerUserHandler(
  request: RegisterUserHandlerRequestProps,
  reply: FastifyReply
) {
  try {
    const { body } = request;

    const hasUser = await findUserByEmail({
      email: body.email,
      context: { prisma },
    });

    if (hasUser) {
      throw new Error(USER_ERRORS_RESPONSE.EMAIL_ALREADY_EXISTS);
    }

    const user = await createUser({ input: body, context: { prisma } });
    sendVerifyEmailHandler(user.email);

    return reply.code(HTTP_STATUS_CODE.CREATED).send(user);
  } catch (e) {
    const error = new ErrorHandler(e);
    return reply.code(HTTP_STATUS_CODE.BAD_REQUEST).send(error);
  }
}
