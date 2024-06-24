import * as userService from "@/modules/user/services/user.service";
import {
  mockAuthFindUserByEmailResponse,
  mockAuthInput,
} from "../__mocks__/auth";
import { app } from "@/configurations/app";
import * as hashFunctions from "@/helpers/hash";
import { HTTP_STATUS_CODE } from "@/helpers";
import { AUTH_ERRORS_RESPONSE, JwtProps, cookiesProps } from "../schemas";
import { MOCK_ACCESS_TOKEN, MOCK_REFRESH_TOKEN } from "@/tests";

const BASE_URL = "api/auth";

describe("module/auth.integration", () => {
  it("Should be able to do login and create the auth and refresh token like cookie", async () => {
    jest
      .spyOn(userService, "findUserByEmail")
      .mockResolvedValue(mockAuthFindUserByEmailResponse);
    jest.spyOn(hashFunctions, "verifyPassword").mockResolvedValue(true);

    const response = await app.inject({
      method: "POST",
      url: BASE_URL,
      body: mockAuthInput,
    });

    const accessToken = app.jwt.accessToken.sign({
      id: mockAuthFindUserByEmailResponse.id,
      name: mockAuthFindUserByEmailResponse.name,
    });

    const refreshToken = app.jwt.refreshToken.sign({
      id: mockAuthFindUserByEmailResponse.id,
    });

    const { domain: _, httpOnly, ...cookiesWithoutDomain } = cookiesProps;

    expect(response.cookies).toEqual([
      {
        ...cookiesWithoutDomain,
        sameSite: "Strict",
        name: "access_token",
        value: accessToken,
      },
      {
        ...cookiesWithoutDomain,
        sameSite: "Strict",
        name: "refresh_token",
        value: refreshToken,
        maxAge: 604800,
        httpOnly,
      },
    ]);

    const { exp } = app.jwt.refreshToken.verify<JwtProps>(refreshToken);

    expect(response.statusCode).toEqual(HTTP_STATUS_CODE.OK);
    expect(response.json()).toEqual({ accessToken, validAtRefreshToken: exp });
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
    expect(response.statusCode).toEqual(HTTP_STATUS_CODE.UNAUTHORIZED);
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
    expect(response.statusCode).toEqual(HTTP_STATUS_CODE.UNAUTHORIZED);
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

  it("Should be able to logout user", async () => {
    const response = await app.inject({
      method: "POST",
      url: "api/auth/logout",
      cookies: {
        access_token: MOCK_ACCESS_TOKEN,
        refresh_token: MOCK_REFRESH_TOKEN,
      },
    });

    const [accessToken, refreshToken] = response.cookies;

    expect(accessToken.value).toEqual("");
    expect(refreshToken.value).toEqual("");
  });
});
