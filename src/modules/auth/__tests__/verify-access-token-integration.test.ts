import { app } from "@/configurations/app";
import { HTTP_STATUS_CODE } from "@/helpers";

import { MOCK_REFRESH_TOKEN } from "@/tests";
import * as userServices from "@/modules/user/services/user.service";
import { mockFindUserByIdResponse } from "@/modules/user/__mocks__/find-user-by-email";
import { AUTH_ERRORS_RESPONSE } from "../schemas";

describe("modules/verify-access-token-integration.verifyAccessToken", () => {
  it("Should be able to call refresh access token method", async () => {
    jest
      .spyOn(userServices, "findUserById")
      .mockResolvedValue(mockFindUserByIdResponse);

    const response = await app.inject({
      method: "POST",
      url: "/api/auth/verify",
      cookies: {
        refresh_token: MOCK_REFRESH_TOKEN,
        access_token: "invalid",
      },
    });

    expect(response.statusCode).toEqual(HTTP_STATUS_CODE.NO_CONTENT);
  });

  it("Should be able to return 401 if refresh token is invalid", async () => {
    jest
      .spyOn(userServices, "findUserById")
      .mockResolvedValue(mockFindUserByIdResponse);

    const response = await app.inject({
      method: "POST",
      url: "/api/auth/verify",
      cookies: {
        refresh_token: "invalid",
        access_token: "invalid",
      },
    });

    expect(response.statusCode).toEqual(HTTP_STATUS_CODE.UNAUTHORIZED);
    expect(response.json()).toEqual({
      error: AUTH_ERRORS_RESPONSE.NOT_AUTHORIZED,
    });
  });
});
