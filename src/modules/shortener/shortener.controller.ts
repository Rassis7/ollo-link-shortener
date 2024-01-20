import { FastifyReply, FastifyRequest } from "fastify";
import {
  SHORTENER_ERRORS_RESPONSE,
  type CreateShortenerLink,
  SaveLinkInput,
} from "./shortener.schema";
import { APPLICATION_ERRORS, ErrorHandler } from "@/helpers";
import {
  generateUrlHash,
  getLinkByHashOrAlias,
  shortenerLinkCache,
  shortenerLink,
} from "./shortener.service";
import { prisma } from "@/infra";
import { JwtAuthProps } from "../auth/auth.schema";

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

    const linkInputValues: SaveLinkInput = {
      hash,
      redirectTo: url,
      active: true,
      userId: user.id,
      alias,
      ...restBody,
    };

    await shortenerLinkCache(linkInputValues);
    await shortenerLink({ data: linkInputValues, context: { prisma } });

    const shortenerLinkResponse = `${process.env.OLLO_LI_BASE_URL}/${
      alias ?? hash
    }`;
    return reply.code(200).send({ shortenerLink: shortenerLinkResponse });
  } catch (e) {
    const error = new ErrorHandler(e);
    return reply.code(400).send(error);
  }
}
