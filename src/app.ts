import {
  server,
  addApplicationSchemas,
  addApplicationDocumentation,
} from "@/configurations";
import { userRoutes } from "@/modules/user/user.route";
import { authRoutes } from "@/modules/auth/auth.route";

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

  addApplicationSchemas(server);
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
