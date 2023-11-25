import { EmailParams, MailerSend, Recipient } from "mailersend";
import { EmailHandlerParams, SendEmailProps } from "./email.schema";
import { join } from "node:path";
import { readFileSync } from "node:fs";

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

export async function sendVerifyEmailHandler(props: EmailHandlerParams) {
  const templatePath = join(__dirname, "templates", "email-verify.html");
  const htmlTemplate = readFileSync(templatePath, "utf8");

  const emailProps: SendEmailProps = {
    ...props,
    fromEmail: "vera@ollo.li",
    fromName: "Vera da OLLO.li",
    templateId: null,
    htmlTemplate,
  };

  await sendEmail(emailProps);
}
