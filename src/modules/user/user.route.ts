import { FastifyInstance } from "fastify";
import { changePasswordHandler, registerUserHandler } from "./controllers";
import {
  changePasswordSchema,
  createUserResponseSchema,
  createUserSchema,
} from "./schemas";
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
  fastify.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/changePassword",
    schema: {
      body: changePasswordSchema,
    },
    handler: changePasswordHandler,
  });
}
