import { FastifyReply, FastifyRequest } from "fastify";
import { createUser, findUserByEmail, findUsers } from "./user.service";
import { CreateUserInput, USER_ERRORS_RESPONSE } from "./user.schema";
import { sendVerifyEmailHandler } from "../email/email.service";
import { ErrorHandler } from "@/helpers";

type RegisterUserHandlerRequestProps = FastifyRequest<{
  Body: CreateUserInput;
}>;

export async function registerUserHandler(
  request: RegisterUserHandlerRequestProps,
  reply: FastifyReply
) {
  try {
    const { body } = request;

    const hasUser = await findUserByEmail(body.email);

    if (hasUser) {
      throw new Error(USER_ERRORS_RESPONSE.EMAIL_ALREADY_EXISTS);
    }

    const user = await createUser(body);

    // TODO: In future to send in queue
    await sendVerifyEmailHandler(user.email);

    return reply.code(201).send(user);
  } catch (e) {
    const error = new ErrorHandler(e);
    return reply.code(400).send(error);
  }
}

export async function getUsersHandler(_, reply: FastifyReply) {
  try {
    const users = await findUsers();

    return users;
  } catch (e) {
    const error = new ErrorHandler(e, "Ocorreu um erro ao listar os usuários");
    return reply.code(400).send(error);
  }
}
