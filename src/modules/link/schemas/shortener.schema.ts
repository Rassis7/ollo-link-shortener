import { RefinementCtx, z } from "zod";
import { isPast } from "date-fns";

export enum SHORTENER_ERRORS_RESPONSE {
  URL_NOT_EXISTS = "A URL não foi informada",
  URL_HAS_EXISTS = "A URL informada já existe",
  ALIAS_HAS_EXISTS = "Já existe um link com esse nome personalizado",
  LINK_SHORTENER_NOT_EXISTS = "O link informado não existe",
}

export const shortLinkBase = {
  url: z
    .string({
      required_error: "A url é obrigatória",
      invalid_type_error: "URL inválida",
    })
    .trim()
    .url("URL com formato inválido. EX: https://meusite.com")
    .regex(
      /^(?!.*https?:\/\/ollo\.li(?:\/?|\/oka)?[^A-Za-z0-9]).*$/,
      "URL inválida"
    )
    .transform((url) => (url.startsWith("http") ? url : `https://${url}`)),
  alias: z
    .string({
      invalid_type_error: "O apelido deve ser uma string",
    })
    .refine((alias) => !alias.includes(" "), "O apelido não pode conter espaço")
    .optional(),
  validAt: z
    .string({ invalid_type_error: "Data inválida" })
    .datetime({ message: "Data de validade inválida" })
    .transform((date: string, ctx: RefinementCtx) => {
      const dateAsDate = new Date(date);
      if (isPast(dateAsDate)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "A data de validade deve ser maior que hoje!",
        });
        return z.NEVER;
      }
      return dateAsDate;
    })
    .transform((dateAsDate) => dateAsDate.toISOString())
    .optional(),
  metadata: z
    .object({
      title: z
        .string({
          invalid_type_error: "O título deve ser um texto",
        })
        .optional(),
      description: z
        .string({
          invalid_type_error: "A descrição deve ser um texto",
        })
        .max(
          300,
          "A descrição do metadata deve conter no máximo de 300 caracteres"
        )
        .optional(),
      photo: z
        .string()
        .url({
          message: "URL inválida",
        })
        .optional(),
    })
    .optional(),
};

export const createShortenerLinkSchema = z.object(shortLinkBase);

export const createShortenerLinkResponseSchema = z.object({
  shortLink: z.string().url(),
  active: z.boolean().optional(),
});

const saveLinkSchema = z.object({
  redirectTo: z.string().url(),
  active: z.boolean(),
  hash: z.string(),
  userId: z.string().uuid(),
  validAt: z.string().optional(),
  alias: z.string().optional(),
  metadata: z
    .object({
      title: z.string().optional(),
      description: z.string().optional(),
      photo: z.string().optional(),
    })
    .optional(),
});

const getRedirectLinkValuesSchema = z.object({
  redirectTo: z.string().url(),
  userId: z.string().uuid(),
  alias: z.string().optional(),
});

export const updateShortenerLinkResponseSchema = z.object({
  redirectTo: z.string().url(),
  active: z.boolean(),
  hash: z.string(),
  validAt: z.date(),
  alias: z.string().optional(),
  metadata: z
    .object({
      title: z.string().optional(),
      description: z.string().optional(),
      photo: z.string().optional(),
    })
    .optional(),
});

export type CreateShortenerLink = z.infer<typeof createShortenerLinkSchema>;

export type SaveLinkInput = z.infer<typeof saveLinkSchema>;

export type GetRedirectLinkValuesInput = z.infer<
  typeof getRedirectLinkValuesSchema
>;
