import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import {
  editLinkSchema,
  getAllLinksResponseSchema,
  updateLinkResponseSchema,
} from "./schemas/link.schema";
import {
  editLinkHandler,
  getAllLinksHandler,
} from "./controllers/link.controller";
import {
  createShortenerLinkResponseSchema,
  createShortenerLinkSchema,
} from "./schemas/shortener.schema";
import { registerShortenerLinkHandler } from "./controllers/shortener.controller";

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

  fastify.withTypeProvider<ZodTypeProvider>().route({
    method: "PUT",
    url: "/:id",
    preHandler: [fastify.authenticate],
    schema: {
      body: editLinkSchema,
      response: {
        200: updateLinkResponseSchema,
      },
    },
    handler: editLinkHandler,
  });

  fastify.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/shortener",
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
