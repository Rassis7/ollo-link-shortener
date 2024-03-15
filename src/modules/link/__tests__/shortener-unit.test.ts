import { faker } from "@faker-js/faker";
import {
  generateUrlHash,
  getRedirectLinkValues,
  shortenerLink,
} from "../services/shortener.service";
import { createHash } from "node:crypto";
import { mockContext, context } from "@/tests";
import {
  mockGetRedirectLinkValuesResponse,
  mockGetRedirectValuesInput,
} from "../__mocks__/get-redirect-link";

import {
  mockSaveLinkInput,
  mockSaveLinkResponse,
} from "../__mocks__/save-link";

describe("modules/shortener.unit", () => {
  it("Should be able to generate hash", async () => {
    (createHash as jest.Mock).mockReturnValue({
      update: jest.fn().mockReturnThis(),
      digest: jest.fn().mockReturnValue(Buffer.from("0123456789", "hex")),
    });

    const url = faker.internet.url();
    const hash = generateUrlHash(url);

    expect(hash).toEqual("01234567");
  });

  it("Should be able to return redirect link values", async () => {
    mockContext.prisma.link.findFirst.mockResolvedValue(
      mockGetRedirectLinkValuesResponse
    );

    const linkValues = await getRedirectLinkValues({
      input: mockGetRedirectValuesInput,
      context,
    });

    expect(mockContext.prisma.link.findFirst).toHaveBeenCalledTimes(1);

    expect(mockContext.prisma.link.findFirst).toHaveBeenCalledWith({
      where: mockGetRedirectValuesInput,
    });

    expect(linkValues).toEqual(mockGetRedirectLinkValuesResponse);
  });

  it("Should be able to create link", async () => {
    mockContext.prisma.link.create.mockResolvedValue(mockSaveLinkResponse);

    const newLink = await shortenerLink({
      data: mockSaveLinkInput,
      context,
    });

    expect(mockContext.prisma.link.create).toHaveBeenCalledTimes(1);
    expect(mockContext.prisma.link.create).toHaveBeenCalledWith({
      data: { ...mockSaveLinkInput },
    });

    expect(newLink).toEqual(mockSaveLinkResponse);
  });
});
