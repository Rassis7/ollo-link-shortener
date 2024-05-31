import { mockContext, context, cache } from "@/tests";
import {
  mockCreateUserInput,
  mockCreatedUserResponse,
} from "../__mocks__/create-user";
import {
  changePassword,
  confirmUserAccount,
  createUser,
  findUserByEmail,
  findUserById,
} from "../services";
import * as helpers from "@/helpers/hash";
import { faker } from "@faker-js/faker";
import { mockFindUserByEmailResponse } from "../__mocks__/find-user-by-email";
import { mockUpdateUserResponse } from "../__mocks__/update-user";
import { CACHE_PREFIX } from "@/infra";

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

  it("Should return an user when find by id", async () => {
    mockContext.prisma.user.findUnique.mockResolvedValue(
      mockFindUserByEmailResponse
    );
    const userId = faker.string.uuid();

    const user = await findUserById({ userId, context });

    expect(mockContext.prisma.user.findUnique).toHaveBeenCalledWith({
      where: { id: userId },
    });
    expect(typeof user).toEqual(typeof mockFindUserByEmailResponse);
  });

  it("Should be able to confirm user account", async () => {
    const email = faker.internet.email();
    mockContext.prisma.user.update.mockResolvedValue(mockUpdateUserResponse);
    jest.spyOn(cache, "del");

    await confirmUserAccount({ email, context });

    expect(mockContext.prisma.user.update).toHaveBeenCalledWith({
      where: { email },
      data: { accountConfirmed: true },
    });
    expect(cache.del).toHaveBeenCalledWith(
      CACHE_PREFIX.ACCOUNT_NOT_CONFIRMED,
      mockUpdateUserResponse.id
    );
  });

  it("Should be able to change user password", async () => {
    const email = faker.internet.email();
    const newPassword = faker.internet.password({ length: 10 });

    jest.spyOn(helpers, "generateHash").mockResolvedValue("hashedPassword");
    mockContext.prisma.user.update.mockResolvedValue(mockUpdateUserResponse);

    const user = await changePassword({ email, newPassword, context });

    expect(mockContext.prisma.user.update).toHaveBeenCalledWith({
      where: { email },
      data: { password: "hashedPassword" },
    });

    expect(user.password !== newPassword).toBeTruthy();
  });
});
