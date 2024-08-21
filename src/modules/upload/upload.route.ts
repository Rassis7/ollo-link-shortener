import { FastifyInstance } from "fastify";
import { uploadFileResponseSchema, uploadFileSchema } from "./schemas";
import { uploadFileHandler } from "./controllers";

export async function uploadRoutes(fastify: FastifyInstance) {
  fastify.route({
    method: "POST",
    url: "/",
    preHandler: [fastify.isAuthorized],
    schema: {
      body: uploadFileSchema,
      response: {
        201: uploadFileResponseSchema,
      },
    },
    handler: uploadFileHandler,
  });
}
