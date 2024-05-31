import { CACHE_PREFIX } from "@/infra";
import { cache } from "@/tests";
import { RANDOM_UUID_MOCK } from "@/tests/__mocks__";
import { faker } from "@faker-js/faker";
import { randomUUID } from "node:crypto";
import {
  generateRecoveryPasswordLink,
  sendRecoveryPasswordEmail,
} from "../services";
import { emailProviderInstance } from "@/configurations/email";
import { emailTemplateParamMock } from "../__mocks__/email-template-param";
import { join } from "node:path";
import { readFileSync } from "node:fs";

const templatePath = join(
  __dirname,
  "..",
  "templates",
  "email-recovery-password.html"
);
const htmlTemplate = readFileSync(templatePath, "utf8");

const NOW = new Date("2024-01-21T14:03:21.209Z");

describe("modules/recovery-password-email.unit", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(NOW);
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it("Should be able to generate a single link to recovery password", async () => {
    const cacheSetSpy = jest.spyOn(cache, "set").mockImplementation(jest.fn());
    const cacheExpireSpy = jest
      .spyOn(cache, "expire")
      .mockImplementation(jest.fn());

    (randomUUID as jest.Mock).mockReturnValue(RANDOM_UUID_MOCK);

    const email = faker.internet.email();
    const link = await generateRecoveryPasswordLink({ email });

    expect(link).toEqual(
      `${process.env.INTERNAL_OLLO_LI_BASE_URL}/new-password/${RANDOM_UUID_MOCK}`
    );

    const validAt = 15 * 60; // 15 minutes in seconds
    expect(cacheExpireSpy).toHaveBeenCalledWith(
      CACHE_PREFIX.RECOVERY_PASSWORD,
      RANDOM_UUID_MOCK,
      validAt
    );

    expect(cacheSetSpy).toHaveBeenCalledWith(
      CACHE_PREFIX.RECOVERY_PASSWORD,
      RANDOM_UUID_MOCK,
      email
    );
  });

  it("Should be able to call email provider and send recovery password email with template", async () => {
    (randomUUID as jest.Mock).mockReturnValue(RANDOM_UUID_MOCK);

    const mailSendSpy = jest
      .spyOn(emailProviderInstance.email, "send")
      .mockImplementation(jest.fn());

    const uuid = randomUUID();
    const email = faker.internet.email();
    await sendRecoveryPasswordEmail({ email });

    expect(mailSendSpy).toHaveBeenCalledTimes(1);
    expect(mailSendSpy).toHaveBeenCalledWith({
      ...emailTemplateParamMock,
      from: { email: "no-reply@ollo.li", name: "OLLO.li" },
      to: [{ email, name: undefined }],
      subject: "Redefina sua senha",
      html: htmlTemplate,
      variables: [
        {
          email,
          substitutions: [
            {
              value: "15",
              var: "expire_in",
            },
            {
              value: `${process.env.INTERNAL_OLLO_LI_BASE_URL}/new-password/${uuid}`,
              var: "recoveryPassword_url",
            },
          ],
        },
      ],
    });
  });
});
