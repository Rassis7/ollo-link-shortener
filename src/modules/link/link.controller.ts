import { ErrorHandler, HTTP_STATUS_CODE } from "@/helpers";
import { FastifyReply, FastifyRequest } from "fastify";
import { JwtProps } from "../auth/auth.schema";
import { prisma } from "@/infra";
import {
  getAllLinksByUser,
  getLinkByHashOrAlias,
  saveOrUpdateLinkCache,
  updateLink,
} from "./link.service";
import { EditLink, EditLinkInput, LINK_ERRORS_RESPONSE } from "./link.schema";

export async function getAllLinksHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const user = await request.jwtDecode<JwtProps>();

    const links = await getAllLinksByUser({
      input: { userId: user.id },
      context: { prisma },
    });

    return reply.code(HTTP_STATUS_CODE.OK).send(links ?? []);
  } catch (e) {
    const error = new ErrorHandler(e);
    return reply.code(HTTP_STATUS_CODE.BAD_REQUEST).send(error);
  }
}

export async function editLinkHandler(
  request: FastifyRequest<{
    Body: EditLink;
    Params: { id: string };
  }>,
  reply: FastifyReply
) {
  try {
    const { body, params } = request;

    const links = await getLinkByHashOrAlias({
      input: { hash: body.hash, alias: body?.alias },
      context: { prisma },
    });

    const hasOtherLinkWithSameAlias = links.some(
      (link) => link.id !== params.id && link.alias === body.alias
    );

    if (hasOtherLinkWithSameAlias) {
      throw new Error(LINK_ERRORS_RESPONSE.ALIAS_HAS_EXISTS);
    }

    const linkShorted = links.find((link) => link.id === params.id);

    if (!linkShorted) {
      throw new Error(LINK_ERRORS_RESPONSE.LINK_SHORTENER_NOT_EXISTS);
    }

    const { redirectTo, active, validAt, metadata, alias, hash } =
      await updateLink({
        context: { prisma },
        data: { id: params.id, ...body },
      });

    const linkUpdatedToCache = {
      ...linkShorted,
      active: body?.active ?? linkShorted.active,
      redirectTo: body?.redirectTo ?? linkShorted.redirectTo,
      alias: String(body?.alias ?? linkShorted.alias),
      validAt: String(body?.validAt ?? linkShorted.validAt),
      metadata: linkShorted.metadata as unknown as EditLinkInput["metadata"],
    };

    await saveOrUpdateLinkCache(linkUpdatedToCache);

    return reply.code(HTTP_STATUS_CODE.OK).send({
      redirectTo,
      active,
      validAt,
      metadata,
      alias,
      hash,
    });
  } catch (e) {
    const error = new ErrorHandler(e);
    return reply.code(400).send(error);
  }
}
