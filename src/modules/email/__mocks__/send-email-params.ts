import { faker } from "@faker-js/faker";
import { SendEmailProps } from "../schemas";

export const sendEmailParamsMock: SendEmailProps = {
  fromEmail: faker.internet.email(),
  fromName: faker.person.fullName(),
  recipients: [
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      variables: [
        {
          variable: faker.commerce.productName(),
          value: faker.commerce.price().toString(),
        },
        {
          variable: faker.commerce.productName(),
          value: faker.commerce.price().toString(),
        },
      ],
    },
  ],
  subject: faker.lorem.sentence({ min: 1, max: 3 }),
  templateId: faker.string.nanoid(),
  htmlTemplate: null,
};
