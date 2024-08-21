import { FastifyInstance } from "fastify";
import {
  changePasswordHandler,
  findUserByIdHandler,
  registerUserHandler,
  updateUserHandler,
} from "./controllers";
import {
  changePasswordSchema,
  createUserResponseSchema,
  createUserSchema,
  findUserByIdResponseSchema,
  updateUserInputSchema,
  updateUserResponseSchema,
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
  fastify.withTypeProvider<ZodTypeProvider>().route({
    method: "GET",
    url: "/:userId",
    preHandler: [fastify.isAuthorized],
    schema: {
      response: {
        200: findUserByIdResponseSchema,
      },
    },
    handler: findUserByIdHandler,
  });
  fastify.withTypeProvider<ZodTypeProvider>().route({
    method: "PUT",
    url: "/:userId",
    preHandler: [fastify.isAuthorized],
    schema: {
      body: updateUserInputSchema,
      response: {
        200: updateUserResponseSchema,
      },
    },
    handler: updateUserHandler,
  });
}
