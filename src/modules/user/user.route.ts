import { FastifyInstance } from "fastify";
import { registerUserHandler } from "./controllers";
import { createUserResponseSchema, createUserSchema } from "./schemas";
import { ZodTypeProvider } from "fastify-type-provider-zod";

export async function userRoutes(fastify: FastifyInstance) {
  fastify.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/",
    schema: {
      body: createUserSchema,
      response: {
        201: createUserResponseSchema,
      },
    },
    handler: registerUserHandler,
  });
}
