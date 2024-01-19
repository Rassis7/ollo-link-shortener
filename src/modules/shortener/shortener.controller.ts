import { FastifyReply, FastifyRequest } from "fastify";
import {
  SHORTENER_ERRORS_RESPONSE,
  type CreateShortenerLink,
  SaveLinkInput,
} from "./shortener.schema";
import { ErrorHandler } from "@/helpers";
import {
  getRedirectLinkValues,
  generateUrlHash,
  saveLink,
  saveLinkCache,
  getByAlias,
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

    if (!body.url) {
      throw new Error(SHORTENER_ERRORS_RESPONSE.URL_NOT_EXISTS);
    }

    const linkValues = await getRedirectLinkValues({
      input: {
        redirectTo: body.url,
        alias: body.alias ?? undefined,
        userId: user.id,
      },
      context: { prisma },
    });

    let hash = linkValues?.hash;

    if (!linkValues?.id) {
      const { url, ...restBody } = body;

      if (restBody.alias) {
        const link = await getByAlias({
          alias: restBody.alias,
          context: { prisma },
        });

        if (link?.id) {
          throw new Error(SHORTENER_ERRORS_RESPONSE.ALIAS_HAS_EXISTS);
        }
      }

      hash = generateUrlHash(url);
      const linkInputValues: SaveLinkInput = {
        hash,
        redirectTo: url,
        active: true,
        userId: user.id,
        ...restBody,
      };

      await saveLinkCache(linkInputValues);
      await saveLink({ data: linkInputValues, context: { prisma } });
    }

    const shortenerLink = `${request.protocol}/${request.hostname}/${hash}`;
    return reply.code(200).send({ shortenerLink });
  } catch (e) {
    const error = new ErrorHandler(e);
    return reply.code(400).send(error);
  }
}
