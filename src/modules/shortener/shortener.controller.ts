import { FastifyReply, FastifyRequest } from "fastify";
import {
  SHORTENER_ERRORS_RESPONSE,
  type CreateShortenerLink,
  SaveLinkInput,
  EditShortenerLink,
} from "./shortener.schema";
import { APPLICATION_ERRORS, ErrorHandler } from "@/helpers";
import {
  generateUrlHash,
  getLinkByHashOrAlias,
  saveOrUpdateLinkCache,
  shortenerLink,
  updateLink,
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

export async function editShortenerLinkHandler(
  request: FastifyRequest<{
    Body: EditShortenerLink;
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
      throw new Error(SHORTENER_ERRORS_RESPONSE.ALIAS_HAS_EXISTS);
    }

    const linkShorted = links.find((link) => link.id === params.id);

    if (!linkShorted) {
      throw new Error(APPLICATION_ERRORS.INTERNAL_ERROR);
    }

    const { redirectTo, active, validAt, metadata, alias, hash } =
      await updateLink({
        context: { prisma },
        data: { id: params.id, ...body },
      });

    const linkUpdatedToCache: SaveLinkInput = {
      ...linkShorted,
      active: body?.active ?? linkShorted.active,
      redirectTo: body?.redirectTo ?? linkShorted.redirectTo,
      alias: String(body?.alias ?? linkShorted.alias),
      validAt: String(body?.validAt ?? linkShorted.validAt),
      metadata: linkShorted.metadata as unknown as SaveLinkInput["metadata"],
    };

    await saveOrUpdateLinkCache(linkUpdatedToCache);

    return reply
      .code(200)
      .send({ redirectTo, active, validAt, metadata, alias, hash });
  } catch (e) {
    const error = new ErrorHandler(e);
    return reply.code(400).send(error);
  }
}
