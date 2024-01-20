import { RefinementCtx, z } from "zod";
import { isPast } from "date-fns";

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
    .regex(
      /^(?!.*https?:\/\/ollo\.li(?:\/?|\/oka)?[^A-Za-z0-9]).*$/,
      "URL inválida"
    )
    .transform((url) =>
      url.match(
        /(http(s?):\/\/.)[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)$/gm
      )
        ? url
        : `https://${url}`
    ),
  alias: z
    .string()
    .refine((alias) => !alias.includes(" "), "O apelido não pode conter espaço")
    .optional(),
  validAt: z
    .string()
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
      title: z.string().optional(),
      description: z
        .string()
        .max(
          300,
          "A descrição do metadata deve conter no máximo de 300 caracteres"
        )
        .optional(),
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

const getByLinkHashFromCacheSchema = z.object({
  counter: z.number(),
  redirectTo: z.string().url(),
  validAt: z.string().transform((validAt) => new Date(validAt).toISOString()),
  active: z.boolean(),
});

const getRedirectLinkValuesSchema = z.object({
  redirectTo: z.string().url(),
  userId: z.number(),
  alias: z.string().optional(),
});

export type CreateShortenerLink = z.infer<typeof createShortenerLinkSchema>;

export type GetByLinkHashFromCacheResponse = z.infer<
  typeof getByLinkHashFromCacheSchema
>;

export type SaveLinkInput = z.infer<typeof saveLinkSchema>;

export type GetRedirectLinkValuesInput = z.infer<
  typeof getRedirectLinkValuesSchema
>;
