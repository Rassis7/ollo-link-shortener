import { FastifyReply, FastifyRequest } from "fastify";
import { findUserByEmail } from "@/modules/user/user.service";
import { HTTP_STATUS_CODE, verifyPassword } from "@/helpers";
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

    const token = app.jwt.sign({ id, email, name });
    return reply
      .code(HTTP_STATUS_CODE.NO_CONTENT)
      .cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      });
  } catch (error) {
    const e = new ErrorHandler(error);
    return reply.code(HTTP_STATUS_CODE.UNAUTHORIZED).send(e);
  }
}
