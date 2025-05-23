import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import {
  editLinkSchema,
  getAllLinksResponseSchema,
  updateLinkResponseSchema,
} from "./schemas";
import { editLinkHandler, getAllLinksHandler } from "./controllers";
import {
  createShortenerLinkResponseSchema,
  createShortenerLinkSchema,
} from "./schemas";
import { registerShortenerLinkHandler } from "./controllers";

export async function linkRoutes(fastify: FastifyInstance) {
  fastify.withTypeProvider<ZodTypeProvider>().route({
    method: "GET",
    url: "/",
    preHandler: [fastify.isAuthorized],
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
    preHandler: [fastify.isAuthorized, fastify.isAccountVerified],
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
    preHandler: [fastify.isAuthorized, fastify.isAccountVerified],
    schema: {
      body: createShortenerLinkSchema,
      response: {
        201: createShortenerLinkResponseSchema,
      },
    },
    handler: registerShortenerLinkHandler,
  });
}
