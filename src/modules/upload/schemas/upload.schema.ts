import { z } from "zod";

export enum UPLOAD_FILE_ERRORS {
  FILE_NOT_PROVIDED = "Arquivo não fornecido",
}

export const uploadFileSchema = z.custom<File>();

export const uploadFileResponseSchema = z.object({
  fileUrl: z.string().optional(),
});

export type UploadFileResponse = z.infer<typeof uploadFileResponseSchema>;
