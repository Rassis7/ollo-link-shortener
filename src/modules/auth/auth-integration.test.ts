import * as userService from "@/modules/user/user.service";
import {
  mockAuthFindUserByEmailResponse,
  mockAuthInput,
} from "./__mocks__/auth";
import { app } from "@/configurations";
import * as hashFunctions from "@/helpers/hash";

const BASE_URL = "api/auth";

describe("module/auth.integration", () => {
  it("Should be able to do login and return jwt token", async () => {
    jest
      .spyOn(userService, "findUserByEmail")
      .mockResolvedValue(mockAuthFindUserByEmailResponse);
    jest.spyOn(hashFunctions, "verifyPassword").mockResolvedValue(true);

    const response = await app.inject({
      method: "POST",
      url: BASE_URL,
      body: mockAuthInput,
    });

    const { id, name, email } = mockAuthFindUserByEmailResponse;
    const responseToken = app.jwt.sign({ id, email, name });

    expect(response.json()).toEqual({ accessToken: responseToken });
    expect(response.statusCode).toEqual(200);
  });

  it("Should be able to return error when user not found", async () => {
    jest.spyOn(userService, "findUserByEmail").mockResolvedValue(null);

    const response = await app.inject({
      method: "POST",
      url: BASE_URL,
      body: mockAuthInput,
    });

    expect(response.json()).toEqual({
      message: "Error: Usuário não encontrado",
    });
    expect(response.statusCode).toEqual(401);
  });

  it("Should be able to return error when password is wrong", async () => {
    jest
      .spyOn(userService, "findUserByEmail")
      .mockResolvedValue(mockAuthFindUserByEmailResponse);
    jest.spyOn(hashFunctions, "verifyPassword").mockResolvedValue(false);

    const response = await app.inject({
      method: "POST",
      url: BASE_URL,
      body: mockAuthInput,
    });

    expect(response.json()).toEqual({
      message: "Error: O usuário ou a senha estão inválidos",
    });
    expect(response.statusCode).toEqual(401);
  });

  it("Should be able to return error when jwt token is wrong and route needs to authentication", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/api/users",
    });

    expect(response.json()).toEqual({
      message: "Não autorizado",
    });
    expect(response.statusCode).toEqual(401);
  });
});
