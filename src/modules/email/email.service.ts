import { EmailParams, MailerSend, Recipient } from "mailersend";
import { SendEmailProps } from "./email.schema";
import { join } from "node:path";
import { readFileSync } from "node:fs";
import { randomUUID } from "node:crypto";
import { redis } from "@/infra";
import { addHours } from "date-fns";

const EXPIRE_IN = 48;

const emailProviderInstance = new MailerSend({
  apiKey: String(process.env.MAILERSEND_API_KEY),
});

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

  const validAt = addHours(new Date(), EXPIRE_IN).getMilliseconds();
  await redis.set(`emailVerification/${email}`, urlSuffix, "PX", validAt);
  //  console.log(await redis.ttl(`emailVerification/${email}`));//verify expiration

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
