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
      }, //ver mais em https://daily.dev/blog/fastify-authentication-strategy
      context: { prisma },
    });

    let hash = linkValues?.hash;

    if (!linkValues?.id) {
      const { url, ...restBody } = body;

      if (restBody.alias) {
        const hasAlias = await getByAlias({
          alias: restBody.alias,
          context: { prisma },
        });

        if (hasAlias?.id) {
          throw new Error(SHORTENER_ERRORS_RESPONSE.ALIAS_HAS_EXISTS);
        }
      }

      hash = generateUrlHash(url);
      const cacheParams: SaveLinkInput = {
        hash,
        redirectTo: url,
        active: true,
        userId: user.id,
        ...restBody,
      };

      await saveLinkCache(cacheParams);
      await saveLink({ data: cacheParams, context: { prisma } });
    }

    const shortenerLink = `https://${request.headers.host}/${hash}`;

    return reply.send(200).send({ shortenerLink });
  } catch (e) {
    const error = new ErrorHandler(e);
    return reply.send(400).send(error);
  }
}
