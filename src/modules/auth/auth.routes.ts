import { FastifyInstance } from "fastify";

import { ZodTypeProvider } from "fastify-type-provider-zod";
import { authSchema } from "./schemas";
import {
  authHandler,
  refreshTokenHandler,
  logoutHandler,
  verifyTokenHandler,
} from "./controllers";

export async function authRoutes(fastify: FastifyInstance) {
  fastify.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/",
    schema: {
      body: authSchema,
    },
    handler: authHandler,
  });
  fastify.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/refreshToken",
    preHandler: [fastify.isAuthorized],
    handler: refreshTokenHandler,
  });
  fastify.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/logout",
    preHandler: [fastify.isAuthorized],
    handler: logoutHandler,
  });
  fastify.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/verify",
    preHandler: [fastify.verifyAccessToken],
    handler: verifyTokenHandler,
  });
}
