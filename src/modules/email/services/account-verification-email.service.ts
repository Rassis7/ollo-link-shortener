import {
  SendEmailProps,
  VERIFY_EMAIL_RESPONSE,
} from "../schemas/account-verification-email.schema";
import { join } from "node:path";
import { readFileSync } from "node:fs";
import { randomUUID } from "node:crypto";
import { CACHE_PREFIX, cache } from "@/infra";
import { addHours } from "date-fns";

import { expireCacheInSeconds } from "@/helpers";
import { sendEmail } from "./email.service";

const EXPIRE_IN = 48;

async function generateVerifyEmailUrl(email: string) {
  const urlSuffix = randomUUID();
  const emailParsed = encodeURIComponent(email);

  const validAt = addHours(new Date(), EXPIRE_IN);
  const validAtInSeconds = expireCacheInSeconds(validAt);
  const key = `emailVerification/${email}`;
  await cache.set(CACHE_PREFIX.LINK, key, urlSuffix);
  await cache.expire(CACHE_PREFIX.LINK, key, validAtInSeconds);

  return `${process.env.INTERNAL_OLLO_LI_BASE_URL}/verification/${urlSuffix}?${emailParsed}`;
}

export async function sendVerifyEmailHandler(email: string) {
  const templatePath = join(__dirname, "..", "templates", "email-verify.html");
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

  const restTime = await cache.ttl(CACHE_PREFIX.LINK, key);

  if (restTime <= -1) {
    throw new Error(VERIFY_EMAIL_RESPONSE.CODE_EXPIRED_OR_NOT_EXISTS);
  }

  const verificationCode = await cache.get(CACHE_PREFIX.LINK, key);

  if (verificationCode !== code) {
    throw new Error(VERIFY_EMAIL_RESPONSE.CODE_IS_WRONG);
  }

  await cache.del(CACHE_PREFIX.LINK, key);
}
