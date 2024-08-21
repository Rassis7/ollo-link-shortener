import { Readable } from "stream";
import { randomUUID } from "node:crypto";
import { convertMultipartToFile, upload } from "../services";
import { FileStorage } from "@/infra/storages/file-storage";
import { MultipartFile } from "@fastify/multipart";
import { faker } from "@faker-js/faker";

describe("modules/upload.unit", () => {
  describe("convertMultipartToFile", () => {
    it("should convert a multipart file stream to a File", async () => {
      const readable = new Readable();
      const data = "Hello, world!";
      readable.push(data);
      readable.push(null);

      const multipartFile = {
        file: readable,
        filename: "test.txt",
        mimetype: "text/plain",
      } as MultipartFile;

      const file = await convertMultipartToFile(multipartFile);
      expect(file).toBeInstanceOf(File);
      expect(file.name).toBe("test.txt");
      expect(file.type).toBe("text/plain");
      expect(await file.text()).toBe(data);
    });

    it("should handle stream errors", async () => {
      const readable = new Readable();
      const error = new Error("Stream error");

      process.nextTick(() => readable.emit("error", error));

      const multipartFile = {
        file: readable,
        filename: "test.txt",
        mimetype: "text/plain",
      } as MultipartFile;

      await expect(convertMultipartToFile(multipartFile)).rejects.toThrow(
        error
      );
    });
  });

  describe("upload", () => {
    const mockUUID = faker.string.uuid();
    const mockFileStorageResponse = { fullPath: "some/path/to/file" };
    const mockPublicUrl = faker.internet.url();

    beforeEach(() => {
      (randomUUID as jest.Mock).mockReturnValue(mockUUID);

      jest.spyOn(FileStorage, "upload").mockResolvedValue({
        id: "some-id",
        path: "some-path",
        fullPath: mockFileStorageResponse.fullPath,
      });

      jest
        .spyOn(FileStorage, "getPublicFileUrl")
        .mockReturnValue(mockPublicUrl);
    });

    it("should upload a file and return its public URL", async () => {
      const file = new File(["file content"], "file.txt", {
        type: "text/plain",
      });
      const userId = "user-id";
      const fileType = "txt";

      const publicUrl = await upload({ file, userId, fileType });

      expect(FileStorage.upload).toHaveBeenCalledWith({
        file,
        path: `${userId}/${mockUUID}.${fileType}`,
      });
      expect(FileStorage.getPublicFileUrl).toHaveBeenCalledWith(
        mockFileStorageResponse.fullPath
      );
      expect(publicUrl).toBe(mockPublicUrl);
    });
  });
});
