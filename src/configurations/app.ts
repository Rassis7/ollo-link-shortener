import Fastify, { FastifyRequest } from "fastify";
import fastifyJwt from "@fastify/jwt";
import { ErrorHandler } from "@/helpers";
import pretty from "pino-pretty";
import pino from "pino";
import { ZodError } from "zod";

const logger = pino(
  pretty({
    colorize: true,
    sync: true,
  })
);

const fastify = Fastify({
  logger: process.env.DEBUG_MODE === "true" && logger,
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
  const errorHandler = new ErrorHandler(e);
  this.log.error(errorHandler);

  if (e instanceof ZodError) {
    reply.code(400);
  }

  if (e.statusCode === 404) {
    reply.code(404);
    errorHandler.error = "Rota não encontrada";
  }

  if (e.statusCode === 500) {
    reply.code(500);
    errorHandler.error = "Ocorreu um erro interno";
  }

  if (e.statusCode === 429) {
    reply.code(429);
    errorHandler.error =
      "Você atingiu o limite da taxa! Aguarde 1 minuto, por favor!";
  }

  if (e.statusCode === 401) {
    reply.code(401);
    errorHandler.error = "Não autorizado";
  }

  reply.send(errorHandler);
});

fastify.get("/healthcheck", async () => {
  return { status: "OK" };
});

export { fastify as app, logger };
