import { FastifyReply, FastifyRequest } from "fastify";
import { createUser, findUsers } from "./user.service";
import { CreateUserInput } from "./user.schema";

type RegisterUserHandlerRequestProps = FastifyRequest<{
  Body: CreateUserInput;
}>;

export async function registerUserHandler(
  request: RegisterUserHandlerRequestProps,
  reply: FastifyReply
) {
  const { body } = request;
  const user = await createUser(body);

  return reply.code(201).send(user);
}

export async function getUsersHandler() {
  const users = await findUsers();

  return users;
}
