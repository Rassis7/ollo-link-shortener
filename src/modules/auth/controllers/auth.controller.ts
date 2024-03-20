import { FastifyReply, FastifyRequest } from "fastify";
import { findUserByEmail } from "@/modules/user/services";
import { HTTP_STATUS_CODE, verifyPassword } from "@/helpers";
import { app } from "@/configurations/app";
import { AUTH_ERRORS_RESPONSE, AuthInput } from "../schemas";
import { ErrorHandler } from "@/helpers";
import { prisma } from "@/infra";
import { generateSession } from "../services";

type AuthHandlerRequestProps = FastifyRequest<{
  Body: AuthInput;
}>;

export async function authHandler(
  request: AuthHandlerRequestProps,
  reply: FastifyReply
) {
  try {
    const { body } = request;
    const user = await findUserByEmail({
      email: body.email,
      context: { prisma },
    });

    if (!user) {
      throw new Error(AUTH_ERRORS_RESPONSE.USER_NOT_FOUND);
    }

    const correctPassword = await verifyPassword({
      candidatePassword: body.password,
      hash: user.password,
    });

    if (!correctPassword) {
      throw new Error(AUTH_ERRORS_RESPONSE.USER_OR_PASSWORD_INVALID);
    }

    const { name, email, accountConfirmed } = user;

    await generateSession({
      id: user.id,
      name: String(name ?? ""),
      email,
      accountConfirmed: !!accountConfirmed,
    });

    const token = app.jwt.sign({ id: user.id });

    request.user = {
      id: user.id,
      name,
      email,
      accountConfirmed: !!accountConfirmed,
    };

    return reply
      .setCookie("access_token", token, {
        secure: process.env.NODE_ENV !== "production",
        path: "/",
        domain: process.env.FASTIFY_COOKIE_DOMAIN,
      })
      .code(HTTP_STATUS_CODE.NO_CONTENT)
      .send();
  } catch (error) {
    const e = new ErrorHandler(error);
    return reply.code(HTTP_STATUS_CODE.UNAUTHORIZED).send(e);
  }
}
