import Fastify, { FastifyRequest } from "fastify";
import fastifyJwt from "@fastify/jwt";
import { ErrorHandler } from "@/helpers";

import pino from "pino";

const IS_DEV = process.env.NODE_ENV === "development";

const stream = pino({
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
    },
  },
});

const logger = pino(stream);

const fastify = Fastify({
  logger: IS_DEV && stream,
});

fastify.register(import("@fastify/rate-limit"), {
  max: Number(process.env.FASTIFY_RATE_LIMIT_MAX),
  timeWindow: String(process.env.FASTIFY_RATE_LIMIT_TIME_WINDOW),
});

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

fastify.setErrorHandler(function (e, _, reply) {
  const error = new ErrorHandler(e);

  this.log.error(error);
  if (e.statusCode === 404) {
    reply.code(404);
    error.message = "Rota não encontrada";
  }

  if (e.statusCode === 500) {
    reply.code(500);
    error.message = "Ocorreu um erro interno";
  }

  if (e.statusCode === 429) {
    reply.code(429);
    error.message =
      "Você atingiu o limite da taxa! Aguarde 1 minuto, por favor!";
  }

  if (e.statusCode === 401) {
    reply.code(401);
    error.message = "Não autorizado";
  }

  reply.send(error);
});

fastify.get("/healthcheck", async () => {
  return { status: "OK" };
});

export { fastify, logger };
