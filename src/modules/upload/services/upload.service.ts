import { FileStorage } from "@/infra";
import { MultipartFile } from "@fastify/multipart";
import { Readable } from "stream";
import { randomUUID } from "node:crypto";

type UploadProps = {
  file: File | Blob | FormData;
  fileType: string;
  userId: string;
};

export async function upload({ file, userId, fileType }: UploadProps) {
  const filename = randomUUID();

  const path = `${userId}/${filename}.${fileType}`;

  const fileStorage = await FileStorage.upload({
    file: file,
    path,
  });

  return FileStorage.getPublicFileUrl(fileStorage.fullPath);
}

function streamToBuffer(stream: Readable): Promise<Buffer> {
  if (typeof (stream as any)._read !== "function") {
    (stream as any)._read = () => {};
  }

  return new Promise((resolve, reject) => {
    const chunks: Uint8Array[] = [];
    stream.on("data", (chunk) =>
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
    );
    stream.on("end", () => resolve(Buffer.concat(chunks)));
    stream.on("error", (err) => reject(err));
  });
}

export async function convertMultipartToFile(
  file: MultipartFile
): Promise<File> {
  const buffer = await streamToBuffer(file.file);
  return new File([buffer], file.filename, { type: file.mimetype });
}
