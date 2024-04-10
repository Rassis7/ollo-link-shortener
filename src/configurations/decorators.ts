import fastifyJwt from "@fastify/jwt";
import { app as fastify } from "./app";
import { FastifyReply, FastifyRequest } from "fastify";
import fastifyCookie from "@fastify/cookie";
import { AUTH_ERRORS_RESPONSE } from "@/modules/auth/schemas";
import {
  accountVerifyHandler,
  authorizationMiddleware,
} from "@/modules/auth/middleware";

const jwtResponseMessages = {
  badRequestErrorMessage: AUTH_ERRORS_RESPONSE.TOKEN_WRONG,
  authorizationTokenUntrusted: AUTH_ERRORS_RESPONSE.TOKEN_UNTRUSTED,
  authorizationTokenUnsigned: AUTH_ERRORS_RESPONSE.TOKEN_UNSIGNED,
  authorizationTokenInvalid: AUTH_ERRORS_RESPONSE.TOKEN_INVALID,
  noAuthorizationInHeaderMessage: AUTH_ERRORS_RESPONSE.TOKEN_NOT_SENDED,
  noAuthorizationInCookieMessage: AUTH_ERRORS_RESPONSE.TOKEN_NOT_SENDED,
  badCookieRequestErrorMessage: AUTH_ERRORS_RESPONSE.TOKEN_INVALID,
  authorizationTokenExpiredMessage: AUTH_ERRORS_RESPONSE.TOKEN_EXPIRED,
};

fastify.register(fastifyJwt, () => ({
  namespace: "accessToken",
  secret: String(process.env.FASTIFY_JWT_SECRET_ACCESS_TOKEN),
  sign: {
    expiresIn: String(process.env.FASTIFY_JWT_ACCESS_TOKEN_EXPIRES_IN),
  },
  messages: jwtResponseMessages,
  jwtVerify: "accessTokenVerify",
}));

fastify.register(fastifyJwt, () => ({
  namespace: "refreshToken",
  secret: String(process.env.FASTIFY_JWT_SECRET_REFRESH_TOKEN),
  sign: {
    expiresIn: String(process.env.FASTIFY_JWT_REFRESH_TOKEN_EXPIRES_IN),
  },
  messages: jwtResponseMessages,
  jwtVerify: "refreshTokenVerify",
}));

fastify.register(fastifyCookie);

fastify.after(() => {
  fastify.decorate(
    "isAuthorized",
    async (request: FastifyRequest, reply: FastifyReply) => {
      await authorizationMiddleware(request, reply);
    }
  );
  fastify.decorate(
    "isAccountVerified",
    async (request: FastifyRequest, reply: FastifyReply) => {
      await accountVerifyHandler(request, reply);
    }
  );
});
