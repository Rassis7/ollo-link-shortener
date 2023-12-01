import { FastifyReply, FastifyRequest } from "fastify";
import { findUserByEmail } from "@/modules/user/user.service";
import { verifyPassword } from "@/utils/hash";
import { server } from "@/configurations";
import { AUTH_ERRORS_RESPONSE, AuthInput } from "./auth.schema";
import { ErrorHandler } from "@/helpers/error-handler";

type AuthHandlerRequestProps = FastifyRequest<{
  Body: AuthInput;
}>;

export async function authHandler(
  request: AuthHandlerRequestProps,
  reply: FastifyReply
) {
  try {
    const { body } = request;
    const user = await findUserByEmail(body.email);

    if (!user) {
      throw new Error(AUTH_ERRORS_RESPONSE.USER_OR_PASSWORD_INVALID);
    }

    const correctPassword = await verifyPassword({
      candidatePassword: body.password,
      hash: user.password,
    });

    if (!correctPassword) {
      throw new Error(AUTH_ERRORS_RESPONSE.USER_OR_PASSWORD_INVALID);
    }
    const { password, createdAt, ...rest } = user;

    return reply.code(200).send({ accessToken: server.jwt.sign(rest) });
  } catch (error) {
    const e = new ErrorHandler(error);
    return reply.code(401).send(e);
  }
}
