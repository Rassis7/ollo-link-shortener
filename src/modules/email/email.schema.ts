import { z } from "zod";

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
