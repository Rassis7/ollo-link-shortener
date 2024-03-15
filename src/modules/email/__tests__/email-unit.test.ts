import { emailProviderInstance } from "@/configurations/email";
import { sendEmail } from "../services";

import { sendEmailParamsMock } from "../__mocks__/send-email-params";

const baseEmailCalled = {
  attachments: undefined,
  bcc: undefined,
  cc: undefined,
  html: undefined,
  in_reply_to: undefined,
  personalization: undefined,
  precedence_bulk: undefined,
  reply_to: undefined,
  send_at: undefined,
  tags: undefined,
  text: undefined,
};

describe("modules/email.unit", () => {
  it("Should be able to send a email ", async () => {
    await sendEmail(sendEmailParamsMock);
    expect(emailProviderInstance.email.send).toHaveBeenCalledTimes(1);
    expect(emailProviderInstance.email.send).toHaveBeenCalledWith({
      ...baseEmailCalled,
      template_id: sendEmailParamsMock.templateId,
      from: {
        email: sendEmailParamsMock.fromEmail,
        name: sendEmailParamsMock.fromName,
      },
      subject: sendEmailParamsMock.subject,
      to: [
        {
          email: sendEmailParamsMock.recipients.at(0)?.email,
          name: sendEmailParamsMock.recipients.at(0)?.name,
        },
      ],
      variables: [
        {
          email: sendEmailParamsMock.recipients.at(0)?.email,
          substitutions: [
            {
              value: sendEmailParamsMock.recipients.at(0)?.variables.at(0)
                ?.value,
              var: sendEmailParamsMock.recipients.at(0)?.variables.at(0)
                ?.variable,
            },
            {
              value: sendEmailParamsMock.recipients.at(0)?.variables.at(1)
                ?.value,
              var: sendEmailParamsMock.recipients.at(0)?.variables.at(1)
                ?.variable,
            },
          ],
        },
      ],
    });
  });
});
