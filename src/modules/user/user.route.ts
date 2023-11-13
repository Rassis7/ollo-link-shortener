import { FastifyInstance } from "fastify";
import { getUsersHandler, registerUserHandler } from "./user.controller";
import { $ref } from "./user.schema";

export async function userRoutes(server: FastifyInstance) {
  server.post(
    "/",
    {
      schema: {
        body: $ref("createUserSchema"),
        response: {
          201: $ref("createUserResponseSchema"),
        },
      },
    },
    registerUserHandler
  );

  server.get(
    "/",
    {
      preHandler: [server.authenticate],
      schema: {
        response: {
          201: $ref("getUserResponseSchema"),
        },
      },
    },
    getUsersHandler
  );
}
