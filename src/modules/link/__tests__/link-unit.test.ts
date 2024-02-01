import { mockContext } from "@/tests";
import { mockGetAllLinksResponse } from "../__mocks__/get-all";
import { faker } from "@faker-js/faker";
import { getAllLinksByUser } from "../link.service";

describe("modules/link-unit", () => {
  it("Should be able to return all links to specif user", async () => {
    mockContext.prisma.link.findMany.mockResolvedValue(mockGetAllLinksResponse);

    const userId = faker.string.uuid();
    const links = await getAllLinksByUser({
      input: { userId },
      context: mockContext,
    });

    expect(mockContext.prisma.link.findMany).toHaveBeenCalledTimes(1);
    expect(mockContext.prisma.link.findMany).toHaveBeenCalledWith({
      where: {
        userId,
      },
      select: {
        active: true,
        alias: true,
        hash: true,
        metadata: true,
        redirectTo: true,
        validAt: true,
      },
    });
    expect(links).toEqual(mockGetAllLinksResponse);
  });
});
