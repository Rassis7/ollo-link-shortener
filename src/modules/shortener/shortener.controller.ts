import { FastifyReply, FastifyRequest } from "fastify";
import {
  SHORTENER_ERRORS_RESPONSE,
  type CreateShortenerLink,
} from "./shortener.schema";
import { APPLICATION_ERRORS, ErrorHandler, HTTP_STATUS_CODE } from "@/helpers";
import { generateUrlHash, shortenerLink } from "./shortener.service";
import { prisma } from "@/infra";
import {
  getLinkByHashOrAlias,
  saveOrUpdateLinkCache,
} from "../link/link.service";

type RegisterShortenerLinkHandlerProps = FastifyRequest<{
  Body: CreateShortenerLink;
}>;

export async function registerShortenerLinkHandler(
  request: RegisterShortenerLinkHandlerProps,
  reply: FastifyReply
) {
  try {
    const { body } = request;

    const { url, alias, ...restBody } = body;
    const hash = generateUrlHash(url);

    const links = await getLinkByHashOrAlias({
      input: { hash, alias },
      context: { prisma },
    });

    if (links.length > 0) {
      links.forEach((link) => {
        if (link.alias === alias) {
          throw new Error(SHORTENER_ERRORS_RESPONSE.ALIAS_HAS_EXISTS);
        }

        if (link.hash === hash) {
          throw new Error(APPLICATION_ERRORS.INTERNAL_ERROR);
        }
      });
    }

    const userId = request.user.id;
    const linkInputValues = {
      hash,
      redirectTo: url,
      active: true,
      userId,
      alias,
      ...restBody,
    };

    await saveOrUpdateLinkCache(linkInputValues);
    await shortenerLink({ data: linkInputValues, context: { prisma } });

    const shortenerLinkResponse = `${process.env.OLLO_LI_BASE_URL}/${
      alias ?? hash
    }`;
    return reply
      .code(HTTP_STATUS_CODE.CREATED)
      .send({ shortLink: shortenerLinkResponse });
  } catch (e) {
    const error = new ErrorHandler(e);
    return reply.code(HTTP_STATUS_CODE.BAD_REQUEST).send(error);
  }
}
