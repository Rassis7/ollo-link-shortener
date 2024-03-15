import { z } from "zod";

export enum AUTH_ERRORS_RESPONSE {
  USER_OR_PASSWORD_INVALID = "O usuário ou a senha estão inválidos",
  USER_NOT_FOUND = "Usuário não encontrado",
  NOT_AUTHORIZED = "Não autorizado, por favor faça o login",
  TOKEN_WRONG = "Token informado de maneira incorreta",
  TOKEN_UNTRUSTED = "Token não confiável",
  TOKEN_UNSIGNED = "Token não assinado",
  TOKEN_NOT_SENDED = "Token não enviado",
  TOKEN_INVALID = "Token inválido",
  TOKEN_EXPIRED = "Token expirado",
  TOKEN_NOT_PROVIDED = "Token não informado",
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

export const jwtAuthValues = z.object({
  id: z.string().uuid(),
  iat: z.number(),
  exp: z.number(),
});

export type AuthInput = z.infer<typeof authSchema>;
export type JwtProps = z.infer<typeof jwtAuthValues>;
