import { FastifyReply, FastifyRequest } from "fastify";
import { findUserByEmail } from "@/modules/user/user.service";
import { verifyPassword } from "@/helpers";
import { app } from "@/configurations/app";
import { AUTH_ERRORS_RESPONSE, AuthInput } from "./auth.schema";
import { ErrorHandler } from "@/helpers";
import { prisma } from "@/infra";

type AuthHandlerRequestProps = FastifyRequest<{
  Body: AuthInput;
}>;

export async function authHandler(
  request: AuthHandlerRequestProps,
  reply: FastifyReply
) {
  try {
    const { body } = request;
    const user = await findUserByEmail({
      email: body.email,
      context: { prisma },
    });

    if (!user) {
      throw new Error(AUTH_ERRORS_RESPONSE.USER_NOT_FOUND);
    }

    const correctPassword = await verifyPassword({
      candidatePassword: body.password,
      hash: user.password,
    });

    if (!correctPassword) {
      throw new Error(AUTH_ERRORS_RESPONSE.USER_OR_PASSWORD_INVALID);
    }
    const { id, email, name } = user;

    return reply
      .code(200)
      .send({ accessToken: app.jwt.sign({ id, email, name }) });
  } catch (error) {
    const e = new ErrorHandler(error);
    return reply.code(401).send(e);
  }
}
