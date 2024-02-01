import { z } from "zod";

const linkSchema = z.object({
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

export const getAllLinksResponseSchema = z.array(linkSchema);
