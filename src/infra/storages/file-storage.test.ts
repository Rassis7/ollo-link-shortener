import { supabaseClient } from "../clients/supabase";
import { FileStorage } from "./file-storage";

describe("infra/storages/file-storage", () => {
  const mockBucketName = "mockBucket";
  const mockFileData = { name: "file.jpg", size: 1024, type: "image/jpeg" };
  const mockFile = new File(["file content"], mockFileData.name, {
    type: mockFileData.type,
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe("createBucket", () => {
    it("should create a bucket successfully", async () => {
      const createBucketMock = jest
        .spyOn(supabaseClient.storage, "createBucket")
        .mockResolvedValue({
          data: { name: mockBucketName },
          error: null,
        });

      const bucketName = await FileStorage.createBucket({
        bucketName: mockBucketName,
      });

      expect(createBucketMock).toHaveBeenCalledWith(mockBucketName, {
        public: false,
        allowedMimeTypes: ["*"],
        fileSizeLimit: 1024,
      });
      expect(bucketName).toBe(mockBucketName);
    });

    it("should throw an error if createBucket fails", async () => {
      const mockError = new Error("Bucket creation failed");
      jest
        .spyOn(supabaseClient.storage, "createBucket")
        .mockResolvedValue({ data: null, error: mockError as any });

      await expect(
        FileStorage.createBucket({
          bucketName: mockBucketName,
        })
      ).rejects.toThrow("Bucket creation failed");
    });
  });

  describe("upload", () => {
    it("should upload a file successfully", async () => {
      jest.spyOn(supabaseClient.storage, "from").mockImplementation(
        jest.fn().mockImplementation(() => ({
          upload: jest
            .fn()
            .mockReturnValue({ data: { path: "path/to/file" }, error: null }),
        }))
      );

      const result = await FileStorage.upload({
        file: mockFile,
        path: "path/to/file",
      });

      expect(result).toEqual({ path: "path/to/file" });
    });

    it("should throw an error if upload fails", async () => {
      const mockError = new Error("Upload failed");

      jest.spyOn(supabaseClient.storage, "from").mockImplementation(
        jest.fn().mockImplementation(() => ({
          upload: jest.fn().mockReturnValue({ data: null, error: mockError }),
        }))
      );

      await expect(
        FileStorage.upload({
          file: mockFile,
          path: "path/to/file",
        })
      ).rejects.toThrow("Upload failed");
    });
  });

  describe("getPublicFileUrl", () => {
    it("should return the public URL of the file", () => {
      const fullPath = "path/to/file";
      const publicUrl = FileStorage.getPublicFileUrl(fullPath);

      expect(publicUrl).toBe(`${process.env.SUPABASE_PUBLIC_URL}/${fullPath}`);
    });
  });
});
