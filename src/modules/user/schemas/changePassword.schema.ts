import { z } from "zod";

export enum CHANGE_PASSWORD_ERROS_RESPONSE {
  INVALID_LINK = "Link de alteração de senha inválido",
  NOT_PASSWORD_PROVIDED = "Nenhuma senha informada",
  LINK_EXPIRED = "O link está expirado",
}

export const changePasswordSchema = z.object({
  linkId: z.string().uuid(),
  password: z
    .string()
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9])(?=.*\d)(?=.{8,})/),
});

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
