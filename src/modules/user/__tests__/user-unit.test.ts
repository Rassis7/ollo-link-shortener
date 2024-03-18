import { mockContext, context } from "@/tests";
import {
  mockCreateUserInput,
  mockCreatedUserResponse,
} from "../__mocks__/create-user";
import { confirmUserAccount, createUser, findUserByEmail } from "../services";
import * as helpers from "@/helpers/hash";
import { faker } from "@faker-js/faker";
import { mockFindUserByEmailResponse } from "../__mocks__/find-user-by-email";
import { mockUpdateUserResponse } from "../__mocks__/update-user";

describe("module/user.unit", () => {
  it("Should create a new user", async () => {
    jest.spyOn(helpers, "generateHash").mockResolvedValue("hashedPassword");

    const response = {
      ...mockCreatedUserResponse,
      password: "hashedPassword",
    };
    mockContext.prisma.user.create.mockResolvedValue(response);

    const params = { input: mockCreateUserInput, context };
    const user = await createUser(params);

    expect(helpers.generateHash).toHaveBeenCalledTimes(1);
    expect(user).toEqual(response);

    expect(mockContext.prisma.user.create).toHaveBeenCalledWith({
      data: { ...params.input, password: "hashedPassword" },
    });

    expect(user.password !== mockCreateUserInput.password).toBeTruthy();
    expect(user.password === "hashedPassword").toBeTruthy();
  });

  it("Should return an user when pass correctly email", async () => {
    mockContext.prisma.user.findUnique.mockResolvedValue(
      mockFindUserByEmailResponse
    );
    const email = faker.internet.email();

    const user = await findUserByEmail({ email, context });

    expect(mockContext.prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email },
    });
    expect(typeof user).toEqual(typeof mockFindUserByEmailResponse);
  });

  it("Should be able to confirm user account", async () => {
    const email = faker.internet.email();
    mockContext.prisma.user.update.mockResolvedValue(mockUpdateUserResponse);

    const user = await confirmUserAccount({ email, context });

    expect(mockContext.prisma.user.update).toHaveBeenCalledWith({
      where: { email },
      data: { accountConfirmed: true },
    });
    expect(user?.accountConfirmed).toBeTruthy();
  });
});
