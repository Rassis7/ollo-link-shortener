import { FastifyReply, FastifyRequest } from "fastify";
import { RedirectParams } from "../schemas";
import { resolveRedirectDestination } from "../services";
import { prisma } from "@/infra/clients/prisma";
import { ErrorHandler, HTTP_STATUS_CODE } from "@/helpers";
import { REDIRECTOR_ERRORS_RESPONSE } from "../schemas";

type RedirectHandlerRequest = FastifyRequest<{
  Params: RedirectParams;
}>;

export async function redirectLinkHandler(
  request: RedirectHandlerRequest,
  reply: FastifyReply
) {
  const { hash } = request.params;

  try {
    const { redirectTo } = await resolveRedirectDestination({
      identifier: hash,
      context: { prisma },
    });

    reply.header("Cache-Control", "no-store");
    return reply.redirect(HTTP_STATUS_CODE.MOVED_PERMANENTLY, redirectTo);
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === REDIRECTOR_ERRORS_RESPONSE.LINK_NOT_FOUND
    ) {
      return reply.code(HTTP_STATUS_CODE.NOT_FOUND).send({
        error: REDIRECTOR_ERRORS_RESPONSE.LINK_NOT_FOUND,
      });
    }

    const handledError = new ErrorHandler(error);
    return reply.code(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).send(handledError);
  }
}
