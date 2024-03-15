import { FastifyInstance } from "fastify";
import { authHandler } from "../controllers/auth.controller";
import { authSchema } from "../schemas/auth.schema";
import { ZodTypeProvider } from "fastify-type-provider-zod";

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
