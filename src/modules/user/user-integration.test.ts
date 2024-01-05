import { app } from "@/configurations";
import * as emailService from "../email/email.service";
import {
  mockCreateUserInput,
  mockCreatedUserResponse,
  mockIntegrationCreateUserResponse,
} from "./__mocks__/create-user";
import * as userService from "./user.service";
import { mockFindUserByEmailResponse } from "./__mocks__/find-user-by-email";
import { USER_ERRORS_RESPONSE } from "./user.schema";
import { ErrorHandler } from "@/helpers";
import { MOCK_JWT_TOKEN } from "@/tests";
import { mockFindUsersResponse } from "./__mocks__/find-users";

describe("module/user.integration", () => {
  it("Should call POST /api/users and create an user", async () => {
    jest.spyOn(emailService, "sendVerifyEmailHandler").mockResolvedValue();
    jest
      .spyOn(userService, "createUser")
      .mockResolvedValue(mockCreatedUserResponse);
    jest.spyOn(userService, "findUserByEmail").mockResolvedValue(null);

    const response = await app.inject({
      method: "POST",
      url: "/api/users",
      body: mockCreateUserInput,
    });

    expect(response.headers["content-type"]).toMatch(
      "application/json; charset=utf-8"
    );
    expect(response.json()).toEqual(mockIntegrationCreateUserResponse);
    expect(response.statusCode).toEqual(201);
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
    expect(response.statusCode).toEqual(400);
  });

  it("Should call GET /api/users and return an user list", async () => {
    jest
      .spyOn(userService, "findUsers")
      .mockResolvedValue(mockFindUsersResponse);

    const response = await app.inject({
      method: "GET",
      url: "/api/users",
      headers: { authorization: `Bearer ${MOCK_JWT_TOKEN}` },
    });

    expect(response.json()).toEqual(mockFindUsersResponse);
    expect(response.statusCode).toEqual(200);
  });
});
