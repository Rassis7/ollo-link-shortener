import { FastifyInstance } from "fastify";
import { getUsersHandler, registerUserHandler } from "./user.controller";
import {
  createUserResponseSchema,
  createUserSchema,
  getUserResponseSchema,
} from "./user.schema";
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
    method: "GET",
    url: "/",
    preHandler: [fastify.authenticate],
    schema: {
      response: {
        201: getUserResponseSchema,
      },
    },
    handler: getUsersHandler,
  });
}
