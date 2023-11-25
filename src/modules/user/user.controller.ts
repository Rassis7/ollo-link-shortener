import { FastifyReply, FastifyRequest } from "fastify";
import { createUser, findUsers } from "./user.service";
import { CreateUserInput } from "./user.schema";
import { sendVerifyEmailHandler } from "../email/email.service";

type RegisterUserHandlerRequestProps = FastifyRequest<{
  Body: CreateUserInput;
}>;

export async function registerUserHandler(
  request: RegisterUserHandlerRequestProps,
  reply: FastifyReply
) {
  const { body } = request;
  const user = await createUser(body);

  // TODO: In future send in queue
  await sendVerifyEmailHandler({
    subject: "Confirme Seu Cadastro - Importante!",
    recipients: [
      {
        email: user.email,
        name: null,
        variables: [
          { variable: "expire_in", value: "48" },
          {
            variable: "verification_url",
            value: "https://ollo.li/verification",
          },
        ],
      },
    ],
  });

  return reply.code(201).send(user);
}

export async function getUsersHandler() {
  const users = await findUsers();

  return users;
}
