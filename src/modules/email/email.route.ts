import { FastifyInstance } from "fastify";
import {
  resendVerificationEmailHandler,
  verifyEmailHandler,
} from "./email.controller";
import { $ref } from "./email.schema";

export async function emailRoutes(server: FastifyInstance) {
  server.post(
    "/verify/:verificationCode",
    {
      schema: {
        body: $ref("verifyEmailSchema"),
      },
    },
    verifyEmailHandler
  );

  server.post(
    "/resend",
    {
      schema: {
        body: $ref("verifyEmailSchema"),
      },
    },
    resendVerificationEmailHandler
  );
}
