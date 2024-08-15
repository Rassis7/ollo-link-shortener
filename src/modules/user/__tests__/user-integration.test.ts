import { app } from "@/configurations/app";
import * as accountVerificationEmailService from "../../email/services/account-verification-email.service";
import {
  mockCreateUserInput,
  mockCreatedUserResponse,
  mockIntegrationCreateUserResponse,
} from "../__mocks__/create-user";
import * as userService from "../services/user.service";
import {
  mockFindUserByEmailResponse,
  mockFindUserByIdResponse,
} from "../__mocks__/find-user-by-email";
import { USER_ERRORS_RESPONSE } from "../schemas";
import { ErrorHandler, HTTP_STATUS_CODE } from "@/helpers";
import { CACHE_PREFIX, cache } from "@/infra";
import { inject } from "@/tests/app";
import { faker } from "@faker-js/faker";

describe("module/user.integration", () => {
  describe('when call POST "/api/users"', () => {
    it("should create an user", async () => {
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
        CACHE_PREFIX.ACCOUNT_NOT_CONFIRMED,
        mockCreatedUserResponse.id,
        "true"
      );
      expect(response.headers["content-type"]).toMatch(
        "application/json; charset=utf-8"
      );
      expect(response.json()).toEqual(mockIntegrationCreateUserResponse);
      expect(response.statusCode).toEqual(HTTP_STATUS_CODE.CREATED);
    });
    it("if cannot send email, should happens nothing", async () => {
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

    describe("if happens an error when trying create a user", () => {
      it("return an error", async () => {
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
  });

  describe('when call GET "/api/users/:userId"', () => {
    it("should return an user", async () => {
      jest
        .spyOn(userService, "findUserById")
        .mockResolvedValue(mockFindUserByIdResponse);

      const response = await inject({
        method: "GET",
        url: `/api/users/${mockFindUserByIdResponse?.id}`,
      });

      expect(response.statusCode).toEqual(HTTP_STATUS_CODE.OK);
      expect(response.json()).toEqual({
        id: mockFindUserByIdResponse?.id,
        name: mockFindUserByIdResponse?.name,
        email: mockFindUserByIdResponse?.email,
        active: mockFindUserByIdResponse?.active,
        accountConfirmed: mockFindUserByIdResponse?.accountConfirmed,
      });
    });
    describe("if user not found", () => {
      it("should return an error", async () => {
        jest.spyOn(userService, "findUserById").mockResolvedValue(null);

        const response = await inject({
          method: "GET",
          url: `/api/users/${faker.string.uuid()}`,
        });

        expect(response.statusCode).toEqual(HTTP_STATUS_CODE.BAD_REQUEST);
        expect(response.json()).toEqual({
          error: USER_ERRORS_RESPONSE.USER_NOT_FOUND,
        });
      });
    });
  });
});
