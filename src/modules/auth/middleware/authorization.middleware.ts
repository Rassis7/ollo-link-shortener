import { FastifyReply, FastifyRequest } from "fastify";
import { AUTH_ERRORS_RESPONSE, JwtProps, cookiesProps } from "../schemas";
import { app } from "@/configurations/app";
import { ErrorHandler, HTTP_STATUS_CODE } from "@/helpers";
import { findUserById } from "@/modules/user/services";
import { prisma } from "@/infra";

async function userRequestFactory(userId: string) {
  const user = await findUserById({ userId, context: { prisma } });

  if (!user) {
    throw new Error(AUTH_ERRORS_RESPONSE.NOT_AUTHORIZED);
  }

  return {
    id: user.id,
    name: user.name,
    accountConfirmed: user?.accountConfirmed ?? false,
  };
}

async function refreshAccessToken({
  request,
  reply,
}: {
  request: FastifyRequest;
  reply: FastifyReply;
}) {
  try {
    const refreshToken = request.cookies.refresh_token;

    if (!refreshToken) {
      throw new Error(AUTH_ERRORS_RESPONSE.TOKEN_NOT_PROVIDED);
    }

    const decodedRefreshToken =
      app.jwt.refreshToken.verify<JwtProps>(refreshToken);

    if (!request.user?.id) {
      const user = await userRequestFactory(decodedRefreshToken.id);

      request.user = user;
    }

    const newAccessToken = app.jwt.accessToken.sign({
      id: request.user.id,
      name: request.user.name,
    });

    reply.setCookie("access_token", newAccessToken, cookiesProps);
  } catch {
    return reply
      .code(HTTP_STATUS_CODE.UNAUTHORIZED)
      .send({ error: AUTH_ERRORS_RESPONSE.NOT_AUTHORIZED });
  }
}

export function authorizationMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const accessToken = request.cookies.access_token;

    if (!accessToken) {
      throw new Error(AUTH_ERRORS_RESPONSE.TOKEN_NOT_PROVIDED);
    }

    const decodedAccessToken =
      app.jwt.accessToken.verify<JwtProps>(accessToken);

    if (!decodedAccessToken.id) {
      throw new Error(AUTH_ERRORS_RESPONSE.NOT_AUTHORIZED);
    }

    if (!request?.user?.id) {
      const { id, name } = decodedAccessToken;
      request.user = { id, name };
    }
  } catch (e) {
    const errorResponse = new ErrorHandler(e);

    if (
      errorResponse?.code?.includes("FAST_JWT") ||
      errorResponse.getError() === AUTH_ERRORS_RESPONSE.NOT_AUTHORIZED
    ) {
      return refreshAccessToken({ request, reply });
    }

    return reply.code(HTTP_STATUS_CODE.UNAUTHORIZED).send(errorResponse);
  }
}
