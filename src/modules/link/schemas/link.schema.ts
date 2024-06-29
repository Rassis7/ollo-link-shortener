import { z } from "zod";
import { shortLinkBase } from "./shortener.schema";

export enum LINK_ERRORS_RESPONSE {
  URL_NOT_EXISTS = "A URL não foi informada",
  URL_HAS_EXISTS = "A URL informada já existe",
  ALIAS_HAS_EXISTS = "Já existe um link com esse nome personalizado",
  LINK_SHORTENER_NOT_EXISTS = "O link informado não existe",
}

const baseLinkSchema = z.object({
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

export const getAllLinksResponseSchema = z.array(baseLinkSchema);

const { url, ...restShortenerBase } = shortLinkBase;

export const editLinkSchema = z.object({
  ...restShortenerBase,
  redirectTo: url.optional(),
  active: z.boolean().optional(),
  hash: z
    .string({
      invalid_type_error: "Deve ser uma string",
      required_error: "Campo obrigatório",
    })
    .min(8, "O hash deve conter 8 caracteres"),
});

const editLinkInputSchema = z.intersection(
  editLinkSchema,
  z.object({
    id: z.string().uuid(),
  })
);

const getByLinkHashFromCacheSchema = z.object({
  counter: z.number(),
  redirectTo: z.string().url(),
  validAt: z.string().transform((validAt) => new Date(validAt).toISOString()),
  active: z.boolean(),
});

const getAllRequestParamsSchema = z.object({
  cursor: z.string().optional(),
  take: z.number(),
});

const getAllLinksByUserSchema = z.object({
  userId: z.string(),
  cursor: z
    .object({
      id: z.string(),
    })
    .optional(),
  take: z.number(),
  skip: z.number(),
});

export const updateLinkResponseSchema = baseLinkSchema;

export type EditLinkInput = z.infer<typeof editLinkInputSchema>;
export type EditLinkResponse = z.infer<typeof updateLinkResponseSchema>;
export type EditLink = z.infer<typeof editLinkSchema>;
export type GetByLinkHashFromCacheResponse = z.infer<
  typeof getByLinkHashFromCacheSchema
>;
export type GetAllRequestParams = z.infer<typeof getAllRequestParamsSchema>;
export type GetAllLinksByUserInput = z.infer<typeof getAllLinksByUserSchema>;
