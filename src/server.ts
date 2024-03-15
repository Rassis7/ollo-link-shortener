import dotenv from "dotenv";
import { resolve } from "node:path";

dotenv.config({ path: resolve(__dirname, `../.env.${process.env.NODE_ENV}`) });

import { app, logger } from "@/configurations/app";
import { heathCheckRoutes } from "./modules/health-check/health-check.routes";
import { userRoutes } from "@/modules/user/user.route";
import { authRoutes } from "@/modules/auth/auth.routes";
import { emailRoutes } from "./modules/email/email.route";
import { linkRoutes } from "./modules/link/link.route";

import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";

import "./configurations/decorators";
import "./configurations/rate-limit";
import "./configurations/errors";

const port = Number(process.env.SERVER_PORT ?? 3000);
const host = process.env.NODE_ENV === "development" ? "localhost" : "0.0.0.0";

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(heathCheckRoutes, { prefix: "healthcheck" });
app.register(userRoutes, { prefix: "api/users" });
app.register(authRoutes, { prefix: "api/auth" });
app.register(emailRoutes, { prefix: "api/email" });
app.register(linkRoutes, { prefix: "api/links" });

function main() {
  if (process.env.NODE_ENV === "test") {
    return;
  }

  // await addApplicationDocumentation(app);

  try {
    app.log.level = "silent";

    app.listen({ port, host }, (error, address) => {
      const debugMode =
        process.env.DEBUG_MODE === "true" ? " ::: DEBUG MODE ACTIVE! 🪲" : "";
      logger.info(`API RUN IN ${address} 🚀 ${debugMode}`);
    });
  } catch (error) {
    logger.error(error);
    process.exit(1);
  }
}

main();

export { app as server };
