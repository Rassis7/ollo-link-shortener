import { app } from "@/configurations/app";
import * as accountVerificationEmailService from "../../email/services/account-verification-email.service";
import {
  mockCreateUserInput,
  mockCreatedUserResponse,
  mockIntegrationCreateUserResponse,
} from "../__mocks__/create-user";
import * as userService from "../services/user.service";
import { mockFindUserByEmailResponse } from "../__mocks__/find-user-by-email";
import { USER_ERRORS_RESPONSE } from "../schemas";
import { ErrorHandler, HTTP_STATUS_CODE } from "@/helpers";
import { CACHE_PREFIX, cache } from "@/infra";

describe("module/user.integration", () => {
  it("Should call POST /api/users and create an user", async () => {
    jest
      .spyOn(accountVerificationEmailService, "sendVerifyEmailHandler")
      .mockResolvedValue();
    jest
      .spyOn(userService, "createUser")
      .mockResolvedValue(mockCreatedUserResponse);
    jest.spyOn(userService, "findUserByEmail").mockResolvedValue(null);
    jest.spyOn(cache, "set");

    const response = await app.inject({
      method: "POST",
      url: "/api/users",
      body: mockCreateUserInput,
    });

    expect(cache.set).toHaveBeenCalledWith(
      CACHE_PREFIX.ACCOUNT_CONFIRMED,
      mockCreatedUserResponse.id,
      "false"
    );
    expect(response.headers["content-type"]).toMatch(
      "application/json; charset=utf-8"
    );
    expect(response.json()).toEqual(mockIntegrationCreateUserResponse);
    expect(response.statusCode).toEqual(HTTP_STATUS_CODE.CREATED);
  });
  it("Should call POST /api/users and create an user but not send email", async () => {
    jest
      .spyOn(accountVerificationEmailService, "sendVerifyEmailHandler")
      .mockRejectedValue(new Error());
    jest
      .spyOn(userService, "createUser")
      .mockResolvedValue(mockCreatedUserResponse);
    jest.spyOn(userService, "findUserByEmail").mockResolvedValue(null);

    const response = await app.inject({
      method: "POST",
      url: "/api/users",
      body: mockCreateUserInput,
    });

    expect(response.json()).toEqual(mockIntegrationCreateUserResponse);
    expect(response.statusCode).toEqual(HTTP_STATUS_CODE.CREATED);
  });

  it("Should call POST /api/users and not create an user", async () => {
    jest
      .spyOn(userService, "findUserByEmail")
      .mockResolvedValue(mockFindUserByEmailResponse);

    const response = await app.inject({
      method: "POST",
      url: "/api/users",
      body: mockCreateUserInput,
    });

    const error = new ErrorHandler(
      new Error(USER_ERRORS_RESPONSE.EMAIL_ALREADY_EXISTS)
    );
    expect(response.json()).toEqual(error);
    expect(response.statusCode).toEqual(HTTP_STATUS_CODE.BAD_REQUEST);
  });
});
