import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { redirectLinkHandler } from "./controllers";
import { redirectParamsSchema } from "./schemas";

export async function redirectorRoutes(fastify: FastifyInstance) {
  fastify.withTypeProvider<ZodTypeProvider>().route({
    method: "GET",
    url: "/:hash",
    schema: {
      params: redirectParamsSchema,
    },
    handler: redirectLinkHandler,
  });
}
