import { FastifyInstance } from "fastify";
import {
  recoveryPasswordEmailHandler,
  resendVerificationEmailHandler,
  verifyEmailHandler,
} from "./controllers";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { verifyEmailSchema } from "./schemas";

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

  fastify.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/recoveryPassword",
    schema: {
      body: verifyEmailSchema,
    },
    handler: recoveryPasswordEmailHandler,
  });
}
