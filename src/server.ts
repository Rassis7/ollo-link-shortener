import dotenv from "dotenv";
import { resolve } from "node:path";

dotenv.config({
  path: resolve(
    __dirname,
    process.env.NODE_ENV === "production"
      ? "../.env"
      : `../.env.${process.env.NODE_ENV}`
  ),
});
import multipart from "@fastify/multipart";

import { app, logger } from "@/configurations/app";
import { heathCheckRoutes } from "./modules/health-check/health-check.routes";
import { userRoutes } from "@/modules/user/user.route";
import { authRoutes } from "@/modules/auth/auth.routes";
import { emailRoutes } from "./modules/email/email.route";
import { linkRoutes } from "./modules/link/link.route";
import { uploadRoutes } from "./modules/upload/upload.route";

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

app.register(multipart);
app.register(heathCheckRoutes, { prefix: "healthcheck" });
app.register(userRoutes, { prefix: "api/users" });
app.register(authRoutes, { prefix: "api/auth" });
app.register(emailRoutes, { prefix: "api/email" });
app.register(linkRoutes, { prefix: "api/links" });
app.register(uploadRoutes, { prefix: "api/upload" });

function main() {
  if (process.env.NODE_ENV === "test") {
    return;
  }

  // await addApplicationDocumentation(app);

  app.listen({ port, host }, (error, address) => {
    if (error) {
      logger.error(error);
    }

    if (process.env.DEBUG_MODE === "true") {
      logger.info("🪲 DEBUG MODE ACTIVATED");
      return;
    }

    logger.info(`🚀 RUN IN: ${address}`);
  });
}

main();

export { app as server };
