import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { getAllLinksResponseSchema } from "./link.schema";
import { getAllLinksHandler } from "./link.controller";

export async function linkRoutes(fastify: FastifyInstance) {
  fastify.withTypeProvider<ZodTypeProvider>().route({
    method: "GET",
    url: "/",
    preHandler: [fastify.authenticate],
    schema: {
      response: {
        200: getAllLinksResponseSchema,
      },
    },
    handler: getAllLinksHandler,
  });
}
