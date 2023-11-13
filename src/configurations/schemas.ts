import { FastifyInstance } from "fastify";
import { userSchemas } from "@/modules/user/user.schema";
import { authSchemas } from "@/modules/auth/auth.schema";

const schemas = [...userSchemas, ...authSchemas];

export function addApplicationSchemas(server: FastifyInstance) {
  for (const schema of schemas) {
    server.addSchema(schema);
  }
}
