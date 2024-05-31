import { z } from "zod";

export enum CHANGE_PASSWORD_ERROS_RESPONSE {
  INVALID_LINK = "Link de alteração de senha inválido",
  NOT_PASSWORD_PROVIDED = "Nenhuma senha informada",
  LINK_EXPIRED = "O link está expirado",
}

export const changePasswordSchema = z.object({
  linkId: z
    .string({
      required_error: "Url para alteração de senha inválida",
      invalid_type_error: "Url para alteração de senha inválida",
    })
    .uuid({
      message: "Formato do url é inválido",
    }),
  password: z
    .string()
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9])(?=.*\d).{8,}$/,
      "Senha fraca, insira uma de acordo com os critérios de segurança"
    ),
});

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
