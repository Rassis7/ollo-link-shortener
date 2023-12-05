import { server, addApplicationDocumentation } from "@/configurations";
import { userRoutes } from "@/modules/user/user.route";
import { authRoutes } from "@/modules/auth/auth.route";
import { emailRoutes } from "./modules/email/email.route";

import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";

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
  server.setValidatorCompiler(validatorCompiler);
  server.setSerializerCompiler(serializerCompiler);

  server.register(userRoutes, { prefix: "api/users" });
  server.register(authRoutes, { prefix: "api/auth" });
  server.register(emailRoutes, { prefix: "api/email" });

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
