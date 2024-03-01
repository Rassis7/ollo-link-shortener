import fastifyJwt, { FastifyJWT } from "@fastify/jwt";
import { app as fastify } from "./app";
import { FastifyReply, FastifyRequest } from "fastify";
import fastifyCookie from "@fastify/cookie";
import { sessionHandler } from "@/modules/auth/auth.controller";

fastify.register(fastifyJwt, () => ({
  secret: String(process.env.FASTIFY_JWT_SECRET),
  sign: {
    expiresIn: process.env.FASTIFY_JWT_SECRET_EXPIRES_IN,
  },
  messages: {
    badRequestErrorMessage: "Token informado de maneira incorreta",
    authorizationTokenUntrusted: "Token não confiável",
    authorizationTokenUnsigned: "Token não assinado",
    authorizationTokenInvalid: "Token não autorizado",
    noAuthorizationInHeaderMessage: "Token não enviado",
    noAuthorizationInCookieMessage: "Token não enviado",
    badCookieRequestErrorMessage: "Token inválido",
    authorizationTokenExpiredMessage: "Token expirado",
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
    "authenticate",
    async (request: FastifyRequestWithCookie, reply: FastifyReply) => {
      await sessionHandler(request, reply);
    }
  );
});
