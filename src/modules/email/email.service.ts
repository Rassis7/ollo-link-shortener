import { SendEmailProps, VERIFY_EMAIL_RESPONSE } from "./email.schema";
import { join } from "node:path";
import { readFileSync } from "node:fs";
import { randomUUID } from "node:crypto";
import { redis } from "@/infra";
import { addHours } from "date-fns";
import {
  EmailParams,
  Recipient,
  emailProviderInstance,
} from "@/configurations/email";

const EXPIRE_IN = 48;

function getEmailParams({
  fromEmail,
  fromName,
  recipients: recipientParams,
  subject,
  templateId,
  htmlTemplate,
}: SendEmailProps) {
  const recipients = recipientParams.map((recipient) => {
    return new Recipient(recipient.email, recipient.name ?? undefined);
  });

  const variables = recipientParams.map((recipient) => {
    const substitutions = recipient.variables.map(({ variable, value }) => ({
      var: variable,
      value,
    }));

    return { email: recipient.email, substitutions };
  });

  const emailParams = new EmailParams()
    .setFrom({ email: fromEmail, name: fromName })
    .setSubject(subject)
    .setVariables(variables)
    .setTo(recipients);

  if (templateId) {
    return emailParams.setTemplateId(templateId);
  }

  return emailParams.setHtml(String(htmlTemplate));
}

async function sendEmail(props: SendEmailProps) {
  const emailParams = getEmailParams(props);
  await emailProviderInstance.email.send(emailParams);
}

async function generateVerifyEmailUrl(email: string) {
  const urlSuffix = randomUUID();
  const emailParsed = encodeURIComponent(email);

  const validAt = addHours(new Date(), EXPIRE_IN).getTime() / 1000;
  const key = `emailVerification/${email}`;
  await redis.set(key, urlSuffix);
  await redis.expire(key, Math.round(validAt));

  return `${process.env.INTERNAL_OLLO_LI_BASE_URL}/verification/${urlSuffix}?${emailParsed}`;
}

export async function sendVerifyEmailHandler(email: string) {
  const templatePath = join(__dirname, "templates", "email-verify.html");
  const htmlTemplate = readFileSync(templatePath, "utf8");
  const verifyUrl = await generateVerifyEmailUrl(email);

  const emailProps: SendEmailProps = {
    subject: process.env.VERIFY_EMAIL_SUBJECT,
    fromEmail: process.env.VERIFY_EMAIL_FROM_EMAIL,
    fromName: process.env.VERIFY_EMAIL_FROM_NAME,
    templateId: null,
    htmlTemplate,
    recipients: [
      {
        email: email,
        name: null,
        variables: [
          { variable: "expire_in", value: EXPIRE_IN.toString() },
          {
            variable: "verification_url",
            value: verifyUrl,
          },
        ],
      },
    ],
  };

  await sendEmail(emailProps);
}

export async function verifyEmail(code: string, email: string) {
  const key = `emailVerification/${email}`;

  const restTime = await redis.ttl(key);

  if (restTime <= -1) {
    throw new Error(VERIFY_EMAIL_RESPONSE.CODE_EXPIRED_OR_NOT_EXISTS);
  }

  const verificationCode = await redis.get(key);

  if (verificationCode !== code) {
    throw new Error(VERIFY_EMAIL_RESPONSE.CODE_IS_WRONG);
  }

  await redis.del(key);
}
