import { FastifyInstance } from "fastify";
import { getUsersHandler, registerUserHandler } from "./user.controller";
import {
  createUserResponseSchema,
  createUserSchema,
  getUserResponseSchema,
} from "./user.schema";
import { ZodTypeProvider } from "fastify-type-provider-zod";

export async function userRoutes(server: FastifyInstance) {
  server.withTypeProvider<ZodTypeProvider>().route({
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

  server.withTypeProvider<ZodTypeProvider>().route({
    method: "GET",
    url: "/",
    preHandler: [server.authenticate],
    schema: {
      response: {
        201: getUserResponseSchema,
      },
    },
    handler: getUsersHandler,
  });
}
