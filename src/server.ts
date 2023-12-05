import { fastify, addApplicationDocumentation } from "@/configurations";
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
  fastify.setValidatorCompiler(validatorCompiler);
  fastify.setSerializerCompiler(serializerCompiler);

  fastify.register(userRoutes, { prefix: "api/users" });
  fastify.register(authRoutes, { prefix: "api/auth" });
  fastify.register(emailRoutes, { prefix: "api/email" });

  await addApplicationDocumentation(fastify);

  try {
    await fastify.listen({ port, host: "0.0.0.0" });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

main();
