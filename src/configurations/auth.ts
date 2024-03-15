import fastifyJwt, { FastifyJWT } from "@fastify/jwt";
import { app as fastify } from "./app";
import { FastifyReply, FastifyRequest } from "fastify";
import fastifyCookie from "@fastify/cookie";
import { AUTH_ERRORS_RESPONSE } from "@/modules/auth/schemas";
import { authorizationMiddleware } from "@/modules/auth/middleware";

fastify.register(fastifyJwt, () => ({
  secret: String(process.env.FASTIFY_JWT_SECRET),
  sign: {
    expiresIn: process.env.FASTIFY_JWT_SECRET_EXPIRES_IN,
  },
  messages: {
    badRequestErrorMessage: AUTH_ERRORS_RESPONSE.TOKEN_WRONG,
    authorizationTokenUntrusted: AUTH_ERRORS_RESPONSE.TOKEN_UNTRUSTED,
    authorizationTokenUnsigned: AUTH_ERRORS_RESPONSE.TOKEN_UNSIGNED,
    authorizationTokenInvalid: AUTH_ERRORS_RESPONSE.TOKEN_INVALID,
    noAuthorizationInHeaderMessage: AUTH_ERRORS_RESPONSE.TOKEN_NOT_SENDED,
    noAuthorizationInCookieMessage: AUTH_ERRORS_RESPONSE.TOKEN_NOT_SENDED,
    badCookieRequestErrorMessage: AUTH_ERRORS_RESPONSE.TOKEN_INVALID,
    authorizationTokenExpiredMessage: AUTH_ERRORS_RESPONSE.TOKEN_EXPIRED,
  },
}));

fastify.register(fastifyCookie);

export interface FastifyRequestWithCookie extends FastifyRequest {
  jwt: FastifyJWT;
  cookies: {
    access_token: string;
  };
}

fastify.after(() => {
  fastify.decorate(
    "authorization",
    async (request: FastifyRequestWithCookie, reply: FastifyReply) => {
      await authorizationMiddleware(request, reply);
    }
  );
});
