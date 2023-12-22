import { mockContext, context } from "@/configurations";
import {
  mockCreateUserInput,
  mockCreatedUserResponse,
} from "./__mocks__/create-user";
import { createUser } from "./user.service";

describe("module/user.unit", () => {
  it("Should create a new user", async () => {
    mockContext.prisma.user?.create.mockResolvedValue(mockCreatedUserResponse);

    const params = { input: mockCreateUserInput, context };

    await expect(createUser(params)).resolves.toEqual(mockCreatedUserResponse);
  });
});
