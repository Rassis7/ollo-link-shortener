import { FastifyInstance } from "fastify";

import { ZodTypeProvider } from "fastify-type-provider-zod";
import { authSchema } from "./schemas/auth.schema";
import { authHandler } from "./controllers/auth.controller";

export async function authRoutes(fastify: FastifyInstance) {
  fastify.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/",
    schema: {
      body: authSchema,
    },
    handler: authHandler,
  });
}
