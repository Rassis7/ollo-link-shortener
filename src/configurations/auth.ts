import fastifyJwt from "@fastify/jwt";
import { app as fastify } from "./app";
import { FastifyRequest } from "fastify";

fastify.register(fastifyJwt, () => ({
  secret: String(process.env.FASTIFY_JWT_SECRET),
  sign: {
    expiresIn: process.env.FASTIFY_JWT_SECRET_EXPIRES_IN,
  },
  messages: {
    badRequestErrorMessage: "Token informado de maneira incorreta",
    authorizationTokenExpiredMessage: "Token expirado",
    authorizationTokenUntrusted: "Token não confiável",
    authorizationTokenUnsigned: "Token não assinado",
  },
}));

fastify.decorate("authenticate", async (request: FastifyRequest) => {
  await request.jwtVerify();
});
