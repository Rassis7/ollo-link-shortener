import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import {
  registerShortenerLinkHandler,
  editShortenerLinkHandler,
} from "./shortener.controller";
import {
  createShortenerLinkResponseSchema,
  createShortenerLinkSchema,
  editShortenerLinkResponseSchema,
  editShortenerLinkSchema,
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

  fastify.withTypeProvider<ZodTypeProvider>().route({
    method: "PUT",
    url: "/:id",
    preHandler: [fastify.authenticate],
    schema: {
      body: editShortenerLinkSchema,
      response: {
        201: editShortenerLinkResponseSchema,
      },
    },
    handler: editShortenerLinkHandler,
  });
}
