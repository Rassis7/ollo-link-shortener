import { z } from "zod";

export enum RECOVERY_PASSWORD_EMAIL_PROPS {
  RECOVERY_PASSWORD_EMAIL_SUBJECT = "Redefina sua senha",
  RECOVERY_PASSWORD_EMAIL_FROM_EMAIL = "no-reply@ollo.li",
  RECOVERY_PASSWORD_EMAIL_FROM_NAME = "OLLO.li",
}

export const recoveryPasswordEmail = z.object({
  email: z.string().email(),
});

export type RecoveryPasswordEmailInput = z.infer<typeof recoveryPasswordEmail>;
