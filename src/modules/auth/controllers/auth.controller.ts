import { FastifyReply, FastifyRequest } from "fastify";
import { findUserByEmail } from "@/modules/user/services";
import { HTTP_STATUS_CODE, verifyPassword } from "@/helpers";
import { app } from "@/configurations/app";
import {
  AUTH_ERRORS_RESPONSE,
  AuthInput,
  JwtProps,
  cookiesProps,
} from "../schemas";
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

    const { id, name, accountConfirmed } = user;

    request.user = { id, name, accountNotConfirmed: !accountConfirmed };

    const accessToken = app.jwt.accessToken.sign({ id, name });
    const refreshToken = app.jwt.refreshToken.sign({ id });

    const { exp } = app.jwt.refreshToken.verify<JwtProps>(refreshToken);

    return reply
      .setCookie("access_token", accessToken, cookiesProps)
      .setCookie("refresh_token", refreshToken, cookiesProps)
      .code(HTTP_STATUS_CODE.OK)
      .send({ accessToken, validAtRefreshToken: exp });
  } catch (error) {
    const e = new ErrorHandler(error);
    return reply.code(HTTP_STATUS_CODE.UNAUTHORIZED).send(e);
  }
}
