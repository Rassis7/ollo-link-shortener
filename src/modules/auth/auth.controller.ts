import { FastifyReply, FastifyRequest } from "fastify";
import { findUserByEmail } from "@/modules/user/user.service";
import { verifyPassword } from "@/utils/hash";
import { server } from "@/configurations";
import { AuthInput } from "./auth.schema";

type AuthHandlerRequestProps = FastifyRequest<{
  Body: AuthInput;
}>;

export async function authHandler(
  request: AuthHandlerRequestProps,
  reply: FastifyReply
) {
  const { body } = request;
  const user = await findUserByEmail(body.email);

  if (!user) {
    return reply.code(401).send({
      message: "Usuário ou senha inválidos",
    });
  }

  const correctPassword = await verifyPassword({
    candidatePassword: body.password,
    hash: user.password,
  });

  if (correctPassword) {
    const { password, createdAt, ...rest } = user;

    return { accessToken: server.jwt.sign(rest) };
  }

  return reply.code(401).send({
    message: "Usuário ou senha inválidos",
  });
}
