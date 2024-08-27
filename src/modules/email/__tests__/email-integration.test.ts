import * as accountVerificationEmailService from "../services/account-verification-email.service";
import { mockEmailInput } from "../__mocks__/verify-code";
import { VERIFY_EMAIL_RESPONSE } from "../schemas";
import { inject } from "@/tests/app";
import * as userService from "@/modules/user/services/user.service";
import { mockFindUserByEmailResponse } from "@/modules/user/__mocks__/find-user-by-email";
import { HTTP_STATUS_CODE } from "@/helpers";

const BASE_URL = "api/email";

describe("modules/email.integration", () => {
  it("Should be able to check if verification code is correctly", async () => {
    jest
      .spyOn(userService, "findUserByEmail")
      .mockResolvedValue(mockFindUserByEmailResponse);

    jest
      .spyOn(accountVerificationEmailService, "verifyEmail")
      .mockResolvedValue();

    const response = await inject({
      method: "POST",
      url: `${BASE_URL}/verify/anything`,
      body: mockEmailInput,
    });

    expect(response.statusCode).toEqual(HTTP_STATUS_CODE.NO_CONTENT);
  });

  it("Should reject if verification code is wrong or email not exists", async () => {
    jest
      .spyOn(accountVerificationEmailService, "verifyEmail")
      .mockRejectedValue(
        new Error(VERIFY_EMAIL_RESPONSE.CODE_EXPIRED_OR_NOT_EXISTS)
      );

    const response = await inject({
      method: "POST",
      url: `${BASE_URL}/verify/anything`,
      body: mockEmailInput,
    });

    expect(response.json()).toEqual({
      error: "O código está expirado ou não existe",
    });
    expect(response.statusCode).toEqual(HTTP_STATUS_CODE.BAD_REQUEST);
  });

  it("Should be able to resend verification email", async () => {
    jest
      .spyOn(accountVerificationEmailService, "sendVerifyEmailHandler")
      .mockResolvedValue();

    const response = await inject({
      method: "POST",
      url: `${BASE_URL}/resend`,
      body: mockEmailInput,
    });

    expect(response.statusCode).toEqual(HTTP_STATUS_CODE.NO_CONTENT);
  });

  it("Should reject if to fail resend email", async () => {
    jest
      .spyOn(accountVerificationEmailService, "sendVerifyEmailHandler")
      .mockRejectedValue(new Error("some_error"));

    const response = await inject({
      method: "POST",
      url: `${BASE_URL}/resend`,
      body: mockEmailInput,
    });

    expect(response.json()).toEqual({
      error: "some_error",
    });
    expect(response.statusCode).toEqual(HTTP_STATUS_CODE.BAD_REQUEST);
  });
});
