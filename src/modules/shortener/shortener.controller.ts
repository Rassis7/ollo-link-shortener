import { FastifyReply, FastifyRequest } from "fastify";
import {
  SHORTENER_ERRORS_RESPONSE,
  type CreateShortenerLink,
} from "./shortener.schema";
import { APPLICATION_ERRORS, ErrorHandler } from "@/helpers";
import { generateUrlHash, shortenerLink } from "./shortener.service";
import { prisma } from "@/infra";
import { JwtAuthProps } from "../auth/auth.schema";
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
    const user = await request.jwtDecode<JwtAuthProps>();

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

    const linkInputValues = {
      hash,
      redirectTo: url,
      active: true,
      userId: user.id,
      alias,
      ...restBody,
    };

    await saveOrUpdateLinkCache(linkInputValues);
    await shortenerLink({ data: linkInputValues, context: { prisma } });

    const shortenerLinkResponse = `${process.env.OLLO_LI_BASE_URL}/${
      alias ?? hash
    }`;
    return reply.code(201).send({ shortLink: shortenerLinkResponse });
  } catch (e) {
    const error = new ErrorHandler(e);
    return reply.code(400).send(error);
  }
}
