import { buildJsonSchemas } from "fastify-zod";
import { z } from "zod";

export enum AUTH_ERRORS_RESPONSE {
  USER_OR_PASSWORD_INVALID = "O usuário ou a senha estão inválidos",
}

const authSchema = z.object({
  email: z
    .string({
      required_error: "O email é obrigatório",
      invalid_type_error: "O email deve ser um texto",
    })
    .email({
      message: "Deve ser um email",
    }),
  password: z.string(),
});

const authResponseSchema = z.object({
  accessToken: z.string(),
});

export type AuthInput = z.infer<typeof authSchema>;

export const { schemas: authSchemas, $ref } = buildJsonSchemas(
  {
    authSchema,
    authResponseSchema,
  },
  {
    $id: "authSchemas",
  }
);
