import { FastifyReply, FastifyRequest } from "fastify";
import { findUserByEmail } from "@/modules/user/services";
import { HTTP_STATUS_CODE, verifyPassword } from "@/helpers";
import { app } from "@/configurations/app";
import { AUTH_ERRORS_RESPONSE, AuthInput } from "../schemas";
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

    const { name, email, accountConfirmed, id: userId } = user;

    request.user = {
      id: userId,
      name,
      email,
      accountConfirmed: !!accountConfirmed,
    };

    const accessToken = app.jwt.accessToken.sign({ id: userId });
    const refreshToken = app.jwt.refreshToken.sign({ id: userId });

    const cookiesProps = {
      secure: true,
      path: "/",
      sameSite: true,
      domain:
        process.env.NODE_ENV === "production"
          ? process.env.FASTIFY_COOKIE_DOMAIN
          : "",
    };

    return reply
      .setCookie("access_token", accessToken, cookiesProps)
      .setCookie("refresh_token", refreshToken, {
        ...cookiesProps,
        httpOnly: true,
      })
      .code(HTTP_STATUS_CODE.OK)
      .send({ accessToken });
  } catch (error) {
    const e = new ErrorHandler(error);
    return reply.code(HTTP_STATUS_CODE.UNAUTHORIZED).send(e);
  }
}
