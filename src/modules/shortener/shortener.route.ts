import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { registerShortenerLinkHandler } from "./shortener.controller";
import {
  createShortenerLinkResponseSchema,
  createShortenerLinkSchema,
} from "./shortener.schema";

export async function shortenerRoutes(fastify: FastifyInstance) {
  fastify.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/",
    preHandler: [fastify.authenticate],
    schema: {
      body: createShortenerLinkSchema,
      response: {
        201: createShortenerLinkResponseSchema,
      },
    },
    handler: registerShortenerLinkHandler,
  });
}
