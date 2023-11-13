import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { FastifyInstance } from "fastify";
import { version } from "../../package.json";

export async function addApplicationDocumentation(server: FastifyInstance) {
  await server.register(fastifySwagger, {
    mode: "dynamic",
    openapi: {
      info: {
        title: `OLLO.li API`,
        description: "Doc OLLO.li",
        version,
      },
      paths: {},
    },
  });

  await server.register(fastifySwaggerUi, {
    routePrefix: "/documentation",
    initOAuth: {},
    uiConfig: {
      docExpansion: "list",
      deepLinking: true,
    },
    uiHooks: {
      onRequest: function (request, reply, next) {
        next();
      },
      preHandler: function (request, reply, next) {
        next();
      },
    },
    staticCSP: false,
    transformStaticCSP: (header) => header,
  });
}
