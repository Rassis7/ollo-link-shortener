import { app } from "@/configurations/app";
import * as emailService from "../email.service";
import { mockEmailInput } from "../__mocks__/verify-code";
import { VERIFY_EMAIL_RESPONSE } from "../email.schema";

const BASE_URL = "api/email";

describe("modules/email.integration", () => {
  it("Should be able to check if verification code is correctly", async () => {
    jest.spyOn(emailService, "verifyEmail").mockResolvedValue();

    const response = await app.inject({
      method: "POST",
      url: `${BASE_URL}/verify/anything`,
      body: mockEmailInput,
    });

    expect(response.statusCode).toEqual(204);
  });

  it("Should reject if verification code is wrong or email not exists", async () => {
    jest
      .spyOn(emailService, "verifyEmail")
      .mockRejectedValue(
        new Error(VERIFY_EMAIL_RESPONSE.CODE_EXPIRED_OR_NOT_EXISTS)
      );

    const response = await app.inject({
      method: "POST",
      url: `${BASE_URL}/verify/anything`,
      body: mockEmailInput,
    });

    expect(response.json()).toEqual({
      message: "Error: O código está expirado ou não existe",
    });
    expect(response.statusCode).toEqual(401);
  });

  it("Should be able to resend verification email", async () => {
    jest.spyOn(emailService, "sendVerifyEmailHandler").mockResolvedValue();

    const response = await app.inject({
      method: "POST",
      url: `${BASE_URL}/resend`,
      body: mockEmailInput,
    });

    expect(response.statusCode).toEqual(200);
  });

  it("Should reject if to fail resend email", async () => {
    jest
      .spyOn(emailService, "sendVerifyEmailHandler")
      .mockRejectedValue(new Error("some_error"));

    const response = await app.inject({
      method: "POST",
      url: `${BASE_URL}/resend`,
      body: mockEmailInput,
    });

    expect(response.json()).toEqual({
      message: "Error: some_error",
    });
    expect(response.statusCode).toEqual(400);
  });
});
