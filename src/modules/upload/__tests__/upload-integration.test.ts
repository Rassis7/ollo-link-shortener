import { HTTP_STATUS_CODE } from "@/helpers";
import { inject } from "@/tests/app";
import * as uploadService from "../services/upload.service";
import { mockMultiPartHeader, mockMultiPartPayload } from "../__mocks__";

const BASE_URL = "api/upload";

describe("modules/upload/upload.integration", () => {
  it("should upload a file and return the file URL", async () => {
    const mockFileUrl = "https://example.com/file.txt";
    jest.spyOn(uploadService, "upload").mockResolvedValue(mockFileUrl);

    const response = await inject({
      method: "POST",
      url: BASE_URL,
      body: mockMultiPartPayload,
      headers: mockMultiPartHeader,
    });

    expect(response.statusCode).toBe(HTTP_STATUS_CODE.CREATED);
    expect(response.json()).toEqual({ fileUrl: mockFileUrl });
  });

  it("should handle errors and return a 400 status code", async () => {
    const errorMessage = "Error converting file";

    jest
      .spyOn(uploadService, "convertMultipartToFile")
      .mockRejectedValue(new Error(errorMessage));

    const response = await inject({
      method: "POST",
      url: BASE_URL,
      payload: mockMultiPartPayload,
      headers: mockMultiPartHeader,
    });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toEqual({ error: errorMessage });
  });
});
