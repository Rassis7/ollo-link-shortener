import { FastifyInstance } from "fastify";
import { authHandler } from "./auth.controller";
import { $ref } from "./auth.schema";

export async function authRoutes(server: FastifyInstance) {
  server.post(
    "/",
    {
      schema: {
        body: $ref("authSchema"),
        response: {
          200: $ref("authResponseSchema"),
        },
      },
    },
    authHandler
  );
}
