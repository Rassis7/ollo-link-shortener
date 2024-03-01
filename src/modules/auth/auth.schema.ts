import { z } from "zod";

export enum AUTH_ERRORS_RESPONSE {
  USER_OR_PASSWORD_INVALID = "O usuário ou a senha estão inválidos",
  USER_NOT_FOUND = "Usuário não encontrado",
  USER_WITHOUT_TOKEN = "Token não informado",
  SESSION_INVALID_TOKEN = "Token não é válido",
  NOT_AUTHORIZED = "Não autorizado, por favor faça o login",
}

export const authSchema = z.object({
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

const jwtAuthValues = z.object({
  id: z.string().uuid(),
  hash: z.string(),
  iat: z.number(),
  exp: z.number(),
});

const sessionScheme = z.intersection(
  jwtAuthValues,
  z.object({
    email: z.string(),
    name: z.string(),
    enabled: z.boolean(),
  })
);

const generateSessionSchema = z.object({
  email: z.string(),
  name: z.string(),
  id: z.string(),
});

export type AuthInput = z.infer<typeof authSchema>;
export type JwtProps = z.infer<typeof jwtAuthValues>;
export type SessionProps = z.infer<typeof sessionScheme>;
export type GenerateSessionProps = z.infer<typeof generateSessionSchema>;
