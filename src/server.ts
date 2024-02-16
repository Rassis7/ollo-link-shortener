import dotenv from "dotenv";
import { resolve } from "node:path";

dotenv.config({ path: resolve(__dirname, `../.env.${process.env.NODE_ENV}`) });

import { app, logger } from "@/configurations/app";
import { userRoutes } from "@/modules/user/user.route";
import { authRoutes } from "@/modules/auth/auth.route";
import { emailRoutes } from "./modules/email/email.route";
import { shortenerRoutes } from "./modules/shortener/shortener.route";

import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import { linkRoutes } from "./modules/link/link.route";

const port =
  process.env.NODE_ENV !== "test" ? Number(process.env.SERVER_PORT) : 4200;

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(userRoutes, { prefix: "api/users" });
app.register(authRoutes, { prefix: "api/auth" });
app.register(emailRoutes, { prefix: "api/email" });
app.register(shortenerRoutes, { prefix: "api/shortener" });
app.register(linkRoutes, { prefix: "api/links" });

async function main() {
  if (process.env.NODE_ENV === "test") {
    return;
  }

  // await addApplicationDocumentation(app);

  try {
    logger.info(`API RUN IN PORT ${port} 🚀`);
    if (process.env.DEBUG_MODE === "true") {
      logger.info("DEBUG MODE ACTIVE! 🪲");
    }
    await app.listen({ port, host: "0.0.0.0" });
  } catch (error) {
    logger.error(error);
    process.exit(1);
  }
}

main();

export { app as server };
