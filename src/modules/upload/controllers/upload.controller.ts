import { ErrorHandler, HTTP_STATUS_CODE } from "@/helpers";
import { FastifyReply, FastifyRequest } from "fastify";
import { convertMultipartToFile, upload } from "../services";

export async function uploadFileHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const files: File[] = [];
    const parts = request.parts();

    for await (const part of parts) {
      if (part.type === "file") {
        const uploadedFile = await convertMultipartToFile(part);
        files.push(uploadedFile);
      }
    }

    const userId = request.user.id;

    const [firstFile] = files;
    const fileUrl = await upload({
      file: firstFile,
      fileType: firstFile.type.split("/")[1],
      userId,
    });

    return reply.code(HTTP_STATUS_CODE.CREATED).send({ fileUrl });
  } catch (e) {
    const error = new ErrorHandler(e);
    return reply.code(400).send(error);
  }
}
