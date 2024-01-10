import { EmailParams } from "@/configurations/email";

export const emailTemplateParamMock: Partial<EmailParams> = {
  cc: undefined,
  bcc: undefined,
  reply_to: undefined,
  in_reply_to: undefined,
  text: undefined,
  html: undefined,
  send_at: undefined,
  attachments: undefined,
  template_id: undefined,
  tags: undefined,
  variables: [],
  personalization: undefined,
  precedence_bulk: undefined,
};
