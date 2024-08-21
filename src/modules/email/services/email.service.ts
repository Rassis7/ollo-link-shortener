import { SendEmailProps } from "../schemas";

import {
  EmailParams,
  Recipient,
  emailProviderInstance,
} from "@/configurations/email";

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

export async function sendEmail(props: SendEmailProps) {
  /* istanbul ignore if */
  // if (process.env.NODE_ENV === "development") {
  //   return;
  // }

  const emailParams = getEmailParams(props);
  await emailProviderInstance.email.send(emailParams);
}
