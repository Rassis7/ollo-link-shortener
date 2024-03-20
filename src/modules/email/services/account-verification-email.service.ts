import {
  SendEmailProps,
  VERIFY_EMAIL_PROPS,
  VERIFY_EMAIL_RESPONSE,
} from "../schemas";
import { join } from "node:path";
import { readFileSync } from "node:fs";
import { randomUUID } from "node:crypto";
import { CACHE_PREFIX, cache } from "@/infra";
import { addHours } from "date-fns";

import { expireCacheInSeconds } from "@/helpers";
import { sendEmail } from "./email.service";
import { confirmUserAccount } from "@/modules/user/services";
import { Context } from "@/configurations/context";
import { updateSession } from "@/modules/auth/services";

const EXPIRE_IN = 48;

async function generateVerifyEmailUrl(email: string) {
  const urlSuffix = randomUUID();
  const emailParsed = encodeURIComponent(email);

  const validAt = addHours(new Date(), EXPIRE_IN);
  const validAtInSeconds = expireCacheInSeconds(validAt);
  await cache.set(CACHE_PREFIX.EMAIL_VERIFICATION, email, urlSuffix);
  await cache.expire(CACHE_PREFIX.EMAIL_VERIFICATION, email, validAtInSeconds);

  return `${process.env.INTERNAL_OLLO_LI_BASE_URL}/verification/${urlSuffix}?${emailParsed}`;
}

export async function sendVerifyEmailHandler(email: string) {
  const templatePath = join(__dirname, "..", "templates", "email-verify.html");
  const htmlTemplate = readFileSync(templatePath, "utf8");
  const verifyUrl = await generateVerifyEmailUrl(email);

  const emailProps: SendEmailProps = {
    subject: VERIFY_EMAIL_PROPS.VERIFY_EMAIL_SUBJECT,
    fromEmail: VERIFY_EMAIL_PROPS.VERIFY_EMAIL_FROM_EMAIL,
    fromName: VERIFY_EMAIL_PROPS.VERIFY_EMAIL_FROM_NAME,
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

export async function verifyEmail({
  code,
  email,
  sessionHash,
  context,
}: {
  code: string;
  email: string;
  sessionHash: string;
  context: Context;
}) {
  const restTime = await cache.ttl(CACHE_PREFIX.EMAIL_VERIFICATION, email);

  if (restTime <= -1) {
    throw new Error(VERIFY_EMAIL_RESPONSE.CODE_EXPIRED_OR_NOT_EXISTS);
  }

  const verificationCode = await cache.get(
    CACHE_PREFIX.EMAIL_VERIFICATION,
    email
  );

  if (verificationCode !== code) {
    throw new Error(VERIFY_EMAIL_RESPONSE.CODE_IS_WRONG);
  }

  await cache.del(CACHE_PREFIX.EMAIL_VERIFICATION, email);

  await Promise.all([
    confirmUserAccount({ email, context }),
    updateSession(sessionHash, { accountConfirmed: true }),
  ]);
}
