import { MailerSend, Recipient, EmailParams } from "mailersend";

const emailProviderInstance = new MailerSend({
  apiKey: String(process.env.MAILERSEND_API_KEY),
});

export { EmailParams, Recipient, emailProviderInstance };
