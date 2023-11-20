import Fastify, { FastifyReply, FastifyRequest } from "fastify";
import fastifyJwt from "@fastify/jwt";

const IS_DEV = process.env.NODE_ENV === "development";

const server = Fastify({
  logger: IS_DEV,
});

server.register(import("@fastify/rate-limit"), {
  max: Number(process.env.FASTIFY_RATE_LIMIT_MAX),
  timeWindow: String(process.env.FASTIFY_RATE_LIMIT_TIME_WINDOW),
});

server.register(fastifyJwt, () => ({
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

server.decorate(
  "authenticate",
  async (request: FastifyRequest, reply: FastifyReply) => {
    await request.jwtVerify();
  }
);

server.setErrorHandler(function (error, _, reply) {
  if (error instanceof Fastify.errorCodes.FST_ERR_BAD_STATUS_CODE) {
    this.log.error(error);

    reply.code(500);
    error.message = "Ocorreu um erro interno";
  }

  if (error.statusCode === 429) {
    reply.code(429);
    error.message =
      "Você atingiu o limite da taxa! Aguarde 1 minuto, por favor!";
  }

  reply.send(error);
});

server.get("/healthcheck", async () => {
  return { status: "OK" };
});

export { server };
