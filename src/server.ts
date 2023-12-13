import { app } from "@/configurations";
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

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(userRoutes, { prefix: "api/users" });
app.register(authRoutes, { prefix: "api/auth" });
app.register(emailRoutes, { prefix: "api/email" });

async function main() {
  // await addApplicationDocumentation(app);

  try {
    await app.listen({ port, host: "0.0.0.0" });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

main();

export { app as server };
