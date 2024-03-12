import { z } from "zod";

export enum VERIFY_EMAIL_RESPONSE {
  CODE_IS_WRONG = "O código está incorreto",
  CODE_EXPIRED_OR_NOT_EXISTS = "O código está expirado ou não existe",
  WAS_HAPPENED_AN_ERROR_WHEN_RESEND_EMAIL = "Ocorreu um erro ao reenviar o email de verificação",
}

export enum VERIFY_EMAIL_PROPS {
  VERIFY_EMAIL_SUBJECT = "Confirme Seu Cadastro - Importante!",
  VERIFY_EMAIL_FROM_EMAIL = "no-reply@ollo.li",
  VERIFY_EMAIL_FROM_NAME = "Vera da OLLO.li",
}

const emailCore = z.object({
  fromEmail: z.string().email(),
  fromName: z.string(),
  recipients: z
    .object({
      name: z.string().nullable(),
      email: z.string().email(),
      variables: z
        .object({
          variable: z.string(),
          value: z.string(),
        })
        .array(),
    })
    .array(),
  subject: z.string(),
  templateId: z.string().nullable(),
  htmlTemplate: z.string().nullable(),
});

export type SendEmailProps = z.infer<typeof emailCore>;

export type EmailHandlerParams = Omit<
  SendEmailProps,
  "fromEmail" | "fromName" | "templateId" | "htmlTemplate" | "subject"
>;

export const verifyEmailSchema = z.object({
  email: z.string().email(),
});

export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;

const verifyEmailParamsSchema = z.object({
  verificationCode: z.string().uuid(),
});

export type VerifyEmailParams = z.infer<typeof verifyEmailParamsSchema>;
