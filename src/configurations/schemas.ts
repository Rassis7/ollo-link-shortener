import { FastifyInstance } from "fastify";
import { JsonSchema } from "fastify-zod";

export function addApplicationSchemas(
  server: FastifyInstance,
  schemas: JsonSchema[]
) {
  for (const schema of schemas) {
    server.addSchema(schema);
  }
}
