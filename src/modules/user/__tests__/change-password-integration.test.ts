import { inject } from "@/tests/app";
import * as changePasswordService from "../services/change-password.service";
import * as userService from "../services/user.service";
import { mockChangePasswordInput } from "../__mocks__/change-password";
import { ErrorHandler, HTTP_STATUS_CODE } from "@/helpers";
import { CHANGE_PASSWORD_ERROS_RESPONSE } from "../schemas";
import { CACHE_PREFIX, cache } from "@/infra";
import { faker } from "@faker-js/faker";
import { User } from "@prisma/client";

const BASE_URL = "api/users/changePassword";

describe("modules/auth/ChangePassword.integration", () => {
  it.each([
    {
      linkId: undefined,
      error: {
        linkId: {
          code: "invalid_type",
          message: "Url para alteração de senha inválida",
          typeError: {
            expected: "string",
            received: "undefined",
          },
        },
      },
    },
    {
      linkId: "",
      error: {
        linkId: {
          code: "invalid_string",
          message: "Formato do url é inválido",
        },
      },
    },
    {
      linkId: 123,
      error: {
        linkId: {
          code: "invalid_type",
          message: "Url para alteração de senha inválida",
          typeError: {
            expected: "string",
            received: "number",
          },
        },
      },
    },
  ])(
    "Should be able to show error when linkId is equal '$linkId'",
    async ({ linkId, error }) => {
      const response = await inject({
        method: "POST",
        url: BASE_URL,
        isAuthorized: false,
        body: { ...mockChangePasswordInput, linkId },
      });

      expect(response.statusCode).toBe(HTTP_STATUS_CODE.BAD_REQUEST);

      expect(response.json()).toEqual({ error });
    }
  );
  it.each([
    "12345678", // Inválida (sem letras maiúsculas, minúsculas ou caracteres especiais)
    "abcdefgh", // Inválida (sem letras maiúsculas, números ou caracteres especiais)
    "ABCDEFGH", // Inválida (sem letras minúsculas, números ou caracteres especiais)
    "abcdEFGH", // Inválida (sem números ou caracteres especiais)
    "abcdEFG1", // Inválida (sem caracteres especiais)
  ])(
    "Should be able to show error when password not respect security rules -> password is like: '%s'",
    async (password) => {
      const response = await inject({
        method: "POST",
        url: BASE_URL,
        isAuthorized: false,
        body: { ...mockChangePasswordInput, password },
      });

      expect(response.statusCode).toBe(HTTP_STATUS_CODE.BAD_REQUEST);

      expect(response.json()).toEqual({
        error: {
          password: {
            code: "invalid_string",
            message:
              "Senha fraca, insira uma de acordo com os critérios de segurança",
          },
        },
      });
    }
  );

  it("Should be able to return an error if link email not exits", async () => {
    jest.spyOn(cache, "get").mockResolvedValue(null);

    const response = await inject({
      method: "POST",
      url: BASE_URL,
      isAuthorized: false,
      body: mockChangePasswordInput,
    });

    const error = new ErrorHandler(
      new Error(CHANGE_PASSWORD_ERROS_RESPONSE.INVALID_LINK)
    );

    expect(response.statusCode).toBe(HTTP_STATUS_CODE.BAD_REQUEST);
    expect(response.json()).toEqual(error);
  });

  it("Should be able to return an error if link is expired", async () => {
    const email = faker.internet.email();
    jest.spyOn(cache, "get").mockResolvedValue(email);
    jest.spyOn(cache, "ttl").mockResolvedValue(0);

    const response = await inject({
      method: "POST",
      url: BASE_URL,
      isAuthorized: false,
      body: mockChangePasswordInput,
    });

    const error = new ErrorHandler(
      new Error(CHANGE_PASSWORD_ERROS_RESPONSE.LINK_EXPIRED)
    );

    expect(response.statusCode).toBe(HTTP_STATUS_CODE.BAD_REQUEST);
    expect(response.json()).toEqual(error);
  });

  it("Should be able to change password with success and remove cache", async () => {
    const email = faker.internet.email();
    jest
      .spyOn(changePasswordService, "getChangePasswordRequestEmail")
      .mockResolvedValue(email);
    jest.spyOn(userService, "changePassword").mockResolvedValue({} as User);

    jest.spyOn(cache, "del").mockResolvedValue();

    const response = await inject({
      method: "POST",
      url: BASE_URL,
      isAuthorized: false,
      body: mockChangePasswordInput,
    });

    expect(cache.del).toHaveBeenCalledWith(
      CACHE_PREFIX.RECOVERY_PASSWORD,
      mockChangePasswordInput.linkId
    );

    expect(response.statusCode).toEqual(HTTP_STATUS_CODE.NO_CONTENT);
  });
});
