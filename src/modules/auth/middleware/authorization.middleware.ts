import { FastifyRequestWithCookie } from "@/configurations/auth";
import { FastifyReply } from "fastify";
import { AUTH_ERRORS_RESPONSE, JwtProps } from "../schemas";
import { generateSession, getSession } from "../services";
import { app } from "@/configurations/app";
import { ErrorHandler, HTTP_STATUS_CODE } from "@/helpers";

export async function authorizationMiddleware(
  request: FastifyRequestWithCookie,
  reply: FastifyReply
) {
  try {
    const jwt = request.cookies.access_token;

    if (!jwt) {
      throw new Error(AUTH_ERRORS_RESPONSE.TOKEN_NOT_PROVIDED);
    }

    const decodedToken = await request.jwtVerify<JwtProps>();
    const session = await getSession(decodedToken.id);

    if (!session || !session.enabled) {
      throw new Error(AUTH_ERRORS_RESPONSE.NOT_AUTHORIZED);
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
