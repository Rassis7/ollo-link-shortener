import { FastifyReply, FastifyRequest } from "fastify";
import { findUserByEmail } from "@/modules/user/user.service";
import { HTTP_STATUS_CODE, verifyPassword } from "@/helpers";
import { app } from "@/configurations/app";
import { AUTH_ERRORS_RESPONSE, AuthInput, JwtProps } from "./auth.schema";
import { ErrorHandler } from "@/helpers";
import { prisma } from "@/infra";
import { FastifyRequestWithCookie } from "@/configurations/auth";
import { generateSession, getSession } from "./auth.service";

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

    const { name, email } = user;

    await generateSession({
      id: user.id,
      name: String(name ?? ""),
      email,
    });

    const token = app.jwt.sign({ id: user.id });

    request.user = { id: user.id, name, email };

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

export async function sessionHandler(
  request: FastifyRequestWithCookie,
  reply: FastifyReply
) {
  try {
    const jwt = request.cookies.access_token;

    if (!jwt) {
      throw new Error(AUTH_ERRORS_RESPONSE.USER_WITHOUT_TOKEN);
    }

    const decodedToken = await request.jwtVerify<JwtProps>();

    if (!decodedToken) {
      throw new Error(AUTH_ERRORS_RESPONSE.SESSION_INVALID_TOKEN);
    }

    const session = await getSession(decodedToken.id);

    if (!session || !session.enabled) {
      throw new Error(AUTH_ERRORS_RESPONSE.NOT_AUTHORIZED);
    }

    if (session.id !== decodedToken.id) {
      throw new Error(AUTH_ERRORS_RESPONSE.SESSION_INVALID_TOKEN);
    }

    request.user = { id: session.id, name: session.name, email: session.email };
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "FST_JWT_AUTHORIZATION_TOKEN_EXPIRED"
    ) {
      const decodedToken = await request.jwtDecode<JwtProps>();
      const session = await getSession(decodedToken.id);

      if (session) {
        await generateSession({ ...session });

        const token = app.jwt.sign({ id: session.id });

        request.user = {
          id: session.id,
          name: session.name,
          email: session.email,
        };

        reply.setCookie("access_token", token, {
          secure: process.env.NODE_ENV !== "production",
          path: "/",
          domain: process.env.FASTIFY_COOKIE_DOMAIN,
        });
        return;
      }
    }

    const errorResponse = new ErrorHandler(error);
    return reply.code(HTTP_STATUS_CODE.UNAUTHORIZED).send(errorResponse);
  }
}
