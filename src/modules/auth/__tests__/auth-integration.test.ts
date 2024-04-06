import * as userService from "@/modules/user/services/user.service";
import {
  mockAuthFindUserByEmailResponse,
  mockAuthInput,
} from "../__mocks__/auth";
import { app } from "@/configurations/app";
import * as hashFunctions from "@/helpers/hash";
import { HTTP_STATUS_CODE } from "@/helpers";
import { AUTH_ERRORS_RESPONSE } from "../schemas";

const BASE_URL = "api/auth";

describe("module/auth.integration", () => {
  it("Should be able to do login and create auth cookie", async () => {
    jest
      .spyOn(userService, "findUserByEmail")
      .mockResolvedValue(mockAuthFindUserByEmailResponse);
    jest.spyOn(hashFunctions, "verifyPassword").mockResolvedValue(true);

    const response = await app.inject({
      method: "POST",
      url: BASE_URL,
      body: mockAuthInput,
    });

    const token = app.jwt.sign({
      id: mockAuthFindUserByEmailResponse.id,
    });

    expect(response.cookies).toEqual([
      {
        name: "access_token",
        httpOnly: true,
        path: "/",
        sameSite: "Strict",
        secure: true,
        value: token,
      },
    ]);

    expect(response.statusCode).toEqual(HTTP_STATUS_CODE.OK);
    expect(response.json()).toEqual({ accessToken: token });
  });

  it("Should be able to return error when user not found", async () => {
    jest.spyOn(userService, "findUserByEmail").mockResolvedValue(null);

    const response = await app.inject({
      method: "POST",
      url: BASE_URL,
      body: mockAuthInput,
    });

    expect(response.json()).toEqual({
      error: "Usuário não encontrado",
    });
    expect(response.statusCode).toEqual(HTTP_STATUS_CODE.BAD_REQUEST);
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
      error: "O usuário ou a senha estão inválidos",
    });
    expect(response.statusCode).toEqual(HTTP_STATUS_CODE.BAD_REQUEST);
  });

  it("Should be able to return error when jwt token is wrong and route needs to authentication", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/api/links",
    });

    expect(response.json()).toEqual({
      error: AUTH_ERRORS_RESPONSE.TOKEN_NOT_PROVIDED,
    });
    expect(response.statusCode).toEqual(HTTP_STATUS_CODE.UNAUTHORIZED);
  });
});
