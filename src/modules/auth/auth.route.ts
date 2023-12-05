import { FastifyInstance } from "fastify";
import { authHandler } from "./auth.controller";
import { authResponseSchema, authSchema } from "./auth.schema";
import { ZodTypeProvider } from "fastify-type-provider-zod";

export async function authRoutes(server: FastifyInstance) {
  server.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/",
    schema: {
      body: authSchema,
      response: {
        201: authResponseSchema,
      },
    },
    handler: authHandler,
  });
}
