import {
  server,
  addApplicationSchemas,
  addApplicationDocumentation,
} from "@/configurations";
import { userRoutes } from "@/modules/user/user.route";
import { authRoutes } from "@/modules/auth/auth.route";
import { emailRoutes } from "./modules/email/email.route";

import { userSchemas } from "@/modules/user/user.schema";
import { authSchemas } from "@/modules/auth/auth.schema";
import { emailSchemas } from "@/modules/email/email.schema";

const schemas = [...userSchemas, ...authSchemas, ...emailSchemas];

declare module "fastify" {
  export interface FastifyInstance {
    authenticate: any;
  }
}

declare module "@fastify/jwt" {
  interface FastifyJWT {
    user: { id: number; name: string; email: string };
  }
}

const port = Number(process.env.SERVER_PORT) ?? 3000;

async function main() {
  server.register(userRoutes, { prefix: "api/users" });
  server.register(authRoutes, { prefix: "api/auth" });
  server.register(emailRoutes, { prefix: "api/email" });

  addApplicationSchemas(server, schemas);
  await addApplicationDocumentation(server);

  try {
    await server.listen({ port, host: "0.0.0.0" });
    console.log(`Server ready at http://localhost:${port}`);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

main();
