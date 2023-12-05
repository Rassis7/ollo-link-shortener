import { FastifyInstance } from "fastify";
import {
  resendVerificationEmailHandler,
  verifyEmailHandler,
} from "./email.controller";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { verifyEmailSchema } from "./email.schema";

export async function emailRoutes(fastify: FastifyInstance) {
  fastify.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/verify/:verificationCode",
    schema: {
      body: verifyEmailSchema,
    },
    handler: verifyEmailHandler,
  });

  fastify.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/resend",
    schema: {
      body: verifyEmailSchema,
    },
    handler: resendVerificationEmailHandler,
  });
}
