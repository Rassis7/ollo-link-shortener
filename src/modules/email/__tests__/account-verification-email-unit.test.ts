import { faker } from "@faker-js/faker";
import { sendVerifyEmailHandler, verifyEmail } from "../services";
import { cache, mockContext } from "@/tests";
import { randomUUID } from "node:crypto";
import { RANDOM_UUID_MOCK } from "@/tests/__mocks__";
import { emailProviderInstance } from "@/configurations/email";
import { join } from "node:path";
import { readFileSync } from "node:fs";
import { emailTemplateParamMock } from "../__mocks__/email-template-param";
import { CACHE_PREFIX } from "@/infra";
import * as userService from "@/modules/user/services/user.service";

const templatePath = join(__dirname, "..", "templates", "email-verify.html");
const htmlTemplate = readFileSync(templatePath, "utf8");

const NOW = new Date("2024-01-21T14:03:21.209Z");

describe("modules/account-verification-email", () => {
  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(NOW);
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it("Should be abe to call email provider and send verification email with template", async () => {
    const CacheSetSpy = jest.spyOn(cache, "set").mockImplementation(jest.fn());
    const CacheExpireSet = jest
      .spyOn(cache, "expire")
      .mockImplementation(jest.fn());

    const mailSendSpy = jest
      .spyOn(emailProviderInstance.email, "send")
      .mockImplementation(jest.fn());

    (randomUUID as jest.Mock).mockReturnValue(RANDOM_UUID_MOCK);

    const email = faker.internet.email();
    await sendVerifyEmailHandler(email);

    // set
    expect(CacheSetSpy).toHaveBeenCalledTimes(1);
    const uuid = randomUUID();
    expect(CacheSetSpy).toHaveBeenCalledWith(
      CACHE_PREFIX.EMAIL_VERIFICATION,
      email,
      uuid
    );

    // expire
    expect(CacheExpireSet).toHaveBeenCalledTimes(1);

    const validAt = 48 * 3600; // 48 hours in seconds
    expect(CacheExpireSet).toHaveBeenCalledWith(
      CACHE_PREFIX.EMAIL_VERIFICATION,
      email,
      validAt
    );

    expect(mailSendSpy).toHaveBeenCalledTimes(1);

    const emailParsed = encodeURIComponent(email);
    expect(mailSendSpy).toHaveBeenCalledWith({
      ...emailTemplateParamMock,
      from: { email: "no-reply@ollo.li", name: "Vera da OLLO.li" },
      to: [{ email, name: undefined }],
      subject: "Confirme Seu Cadastro - Importante!",
      html: htmlTemplate,
      variables: [
        {
          email,
          substitutions: [
            {
              value: "48",
              var: "expire_in",
            },
            {
              value: `${process.env.INTERNAL_OLLO_LI_BASE_URL}/verification/${uuid}?email=${emailParsed}`,
              var: "verification_url",
            },
          ],
        },
      ],
    });
  });

  it("Should be abe to check if verification email is valid", async () => {
    const code = faker.number.int({ min: 100, max: 999 }).toString();

    jest.spyOn(cache, "ttl").mockResolvedValue(1);
    jest.spyOn(cache, "get").mockResolvedValue(code);
    jest.spyOn(cache, "del").mockImplementation(jest.fn());
    jest.spyOn(userService, "confirmUserAccount").mockResolvedValue();

    const email = faker.internet.email();

    await verifyEmail({ code, email, context: mockContext });

    expect(cache.ttl).toHaveBeenCalledTimes(1);
    expect(cache.ttl).toHaveBeenCalledWith(
      CACHE_PREFIX.EMAIL_VERIFICATION,
      email
    );

    expect(cache.get).toHaveBeenCalledTimes(1);

    expect(cache.del).toHaveBeenCalledTimes(1);
    expect(cache.del).toHaveBeenCalledWith(
      CACHE_PREFIX.EMAIL_VERIFICATION,
      email
    );

    expect(userService.confirmUserAccount).toHaveBeenCalledTimes(1);
    expect(userService.confirmUserAccount).toHaveBeenCalledWith({
      email,
      context: mockContext,
    });
  });

  it.each([
    ["code was expired", -1],
    ["email not exists", -2],
  ])(
    "Should reject to email verification if %s in cache",
    async (_, CacheResponse: number) => {
      jest.spyOn(cache, "ttl").mockResolvedValue(CacheResponse);

      const email = faker.internet.email();
      const code = faker.number.int({ min: 100, max: 999 }).toString();

      expect(async () =>
        verifyEmail({ code, email, context: mockContext })
      ).rejects.toThrow(/o código está expirado ou não existe/i);
    }
  );

  it("Should be abe to check if verification code is wrong", async () => {
    const code = faker.number.int({ min: 100, max: 999 }).toString();

    jest.spyOn(cache, "ttl").mockResolvedValue(1);
    jest.spyOn(cache, "get").mockResolvedValue(code);

    const email = faker.internet.email();

    expect(async () =>
      verifyEmail({
        code: "OTHER_CODE",
        email,
        context: mockContext,
      })
    ).rejects.toThrow(/o código está incorreto/i);
  });
});
