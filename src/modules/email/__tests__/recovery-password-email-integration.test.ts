import * as userService from "@/modules/user/services/user.service";
import { mockUser } from "../__mocks__/user";
import * as recoveryPasswordService from "../services/recovery-password-email.service";
import { inject } from "@/tests/app";
import { faker } from "@faker-js/faker";

const EMAIL = faker.internet.email();
const BASE_URL = "api/email";

describe("modules/recovery-password-email.integration", () => {
  it("Should be able to send recovery email if user exists", async () => {
    jest.spyOn(userService, "findUserByEmail").mockResolvedValue(mockUser);
    jest
      .spyOn(recoveryPasswordService, "sendRecoveryPasswordEmail")
      .mockResolvedValue();

    await inject({
      isAuthorized: false,
      url: `${BASE_URL}/recoveryPassword`,
      method: "POST",
      body: {
        email: EMAIL,
      },
    });

    expect(
      recoveryPasswordService.sendRecoveryPasswordEmail
    ).toHaveBeenCalledTimes(1);
  });
  it("Should be able to not send recovery email if user exists", async () => {
    jest.spyOn(userService, "findUserByEmail").mockResolvedValue(null);

    jest
      .spyOn(recoveryPasswordService, "sendRecoveryPasswordEmail")
      .mockResolvedValue();

    await inject({
      isAuthorized: false,
      url: `${BASE_URL}/recoveryPassword`,
      method: "POST",
      body: {
        email: EMAIL,
      },
    });

    expect(
      recoveryPasswordService.sendRecoveryPasswordEmail
    ).not.toHaveBeenCalled();
  });
});
