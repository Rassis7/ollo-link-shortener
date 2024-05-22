import { randomUUID } from "node:crypto";
import { addMinutes } from "date-fns";
import { expireCacheInSeconds } from "@/helpers";
import { CACHE_PREFIX, cache } from "@/infra";
import { join } from "node:path";
import { readFileSync } from "node:fs";
import { RECOVERY_PASSWORD_EMAIL_PROPS, SendEmailProps } from "../schemas";
import { sendEmail } from "./email.service";

const EXPIRE_IN = 15;

export async function generateRecoveryPasswordLink({
  email,
}: {
  email: string;
}) {
  const urlSuffix = randomUUID();

  const validAt = addMinutes(new Date(), EXPIRE_IN);
  const validAtInSeconds = expireCacheInSeconds(validAt);
  await cache.set(CACHE_PREFIX.RECOVERY_PASSWORD, email, urlSuffix);
  await cache.expire(CACHE_PREFIX.RECOVERY_PASSWORD, email, validAtInSeconds);

  return `${process.env.INTERNAL_OLLO_LI_BASE_URL}/recovery-password/${urlSuffix}`;
}

export async function sendRecoveryPasswordEmail({ email }: { email: string }) {
  const recoveryPasswordUrl = await generateRecoveryPasswordLink({ email });

  const templatePath = join(
    __dirname,
    "..",
    "templates",
    "email-recovery-password.html"
  );
  const htmlTemplate = readFileSync(templatePath, "utf8");

  const emailProps: SendEmailProps = {
    subject: RECOVERY_PASSWORD_EMAIL_PROPS.RECOVERY_PASSWORD_EMAIL_SUBJECT,
    fromEmail: RECOVERY_PASSWORD_EMAIL_PROPS.RECOVERY_PASSWORD_EMAIL_FROM_EMAIL,
    fromName: RECOVERY_PASSWORD_EMAIL_PROPS.RECOVERY_PASSWORD_EMAIL_FROM_NAME,
    templateId: null,
    htmlTemplate,
    recipients: [
      {
        email: email,
        name: null,
        variables: [
          { variable: "expire_in", value: EXPIRE_IN.toString() },
          {
            variable: "recoveryPassword_url",
            value: recoveryPasswordUrl,
          },
        ],
      },
    ],
  };

  await sendEmail(emailProps);
}
