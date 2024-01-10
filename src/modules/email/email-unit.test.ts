import { faker } from "@faker-js/faker";
import { sendVerifyEmailHandler } from "./email.service";
import { redis } from "@/tests";
import { randomUUID } from "node:crypto";
import { RANDOM_UUID_MOCK } from "@/tests/__mocks__";
import { emailProviderInstance } from "@/configurations/email";
import { join } from "node:path";
import { readFileSync } from "node:fs";
import { emailTemplateParamMock } from "./__mocks__/email-template-param-mock";

const templatePath = join(__dirname, "templates", "email-verify.html");
const htmlTemplate = readFileSync(templatePath, "utf8");

describe("modules/email.unit", () => {
  it("Should be abe to call email provider and send verification email with template", async () => {
    const redisSetSpy = jest.spyOn(redis, "set").mockImplementation(jest.fn());
    const redisExpireSet = jest
      .spyOn(redis, "expire")
      .mockImplementation(jest.fn());

    const mailSendSpy = jest
      .spyOn(emailProviderInstance.email, "send")
      .mockImplementation(jest.fn());

    (randomUUID as jest.Mock).mockReturnValue(RANDOM_UUID_MOCK);

    const email = faker.internet.email();
    await sendVerifyEmailHandler(email);

    const key = `emailVerification/${email}`;

    // set
    expect(redisSetSpy).toHaveBeenCalledTimes(1);
    const uuid = randomUUID();
    expect(redisSetSpy).toHaveBeenCalledWith(key, uuid);

    // expire
    expect(redisExpireSet).toHaveBeenCalledTimes(1);
    const validAt = new Date().getTime() / 1000;
    expect(redisExpireSet).toHaveBeenCalledWith(key, Math.round(validAt));

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
              value: `${process.env.INTERNAL_OLLO_LI_BASE_URL}/verification/${uuid}?${emailParsed}`,
              var: "verification_url",
            },
          ],
        },
      ],
    });
  });
  it.todo("Should be not abe to send verification");
  it.todo("Should be abe to check if verification email is valid");
  it.todo("Should be abe to check if verification email not exists in redis");
  it.todo("Should be abe to check if verification code is wrong");
  it.todo("Should be abe to check if verification code was expired");
});
