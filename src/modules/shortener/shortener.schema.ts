import { z } from "zod";

export enum SHORTENER_ERRORS_RESPONSE {
  URL_NOT_EXISTS = "A URL não foi informada",
  URL_HAS_EXISTS = "A url informada já existe",
  ALIAS_HAS_EXISTS = "Já existe um link com esse nome personalizado",
}

export const createShortenerLinkSchema = z.object({
  url: z
    .string({
      required_error: "A url é obrigatória",
      invalid_type_error: "URL inválida",
    })
    .trim()
    .url("URL com formato inválido. EX: https://meusite.com")
    .regex(/((http(s?):\/\/)?)ollo.li(\/?)[^A-Za-z0-9]/, "URL inválida")
    .transform((url) =>
      url.match(
        /(http(s?):\/\/.)[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)$/gm
      )
        ? `https://${url}`
        : url
    ),
  alias: z.string().optional(),
  validAt: z
    .date()
    .min(new Date(), "A data deve ser maior que hoje")
    .transform((date) => date.toISOString()),
  metadata: z
    .object({
      title: z.string().optional(),
      description: z.string().max(300, "Máximo de 300 caracteres").optional(),
      photo: z.string().url().optional(),
    })
    .optional(),
});

export const createShortenerLinkResponseSchema = z.object({
  shortLink: z.string().url(),
});

const saveLinkSchema = z.object({
  redirectTo: z.string().url(),
  active: z.boolean(),
  hash: z.string(),
  userId: z.number(),
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

const getByHashSchema = z.object({
  counter: z.number(),
  redirectTo: z.string().url(),
  validAt: z.string().transform((validAt) => new Date(validAt)),
  active: z.boolean(),
});

createShortenerLinkSchema.parse(undefined);
export type CreateShortenerLink = z.infer<typeof createShortenerLinkSchema>;

export type GetByHashResponse = z.infer<typeof getByHashSchema>;

saveLinkSchema.parse(undefined);
export type SaveLinkInput = z.infer<typeof saveLinkSchema>;
