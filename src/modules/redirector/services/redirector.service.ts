import { Context } from "@/configurations/context";
import {
  getLinkByHashFromCache,
  getLinkByHashOrAlias,
  saveOrUpdateLinkCache,
} from "@/modules/link/services";
import { REDIRECTOR_ERRORS_RESPONSE } from "../schemas";
import { Link } from "@prisma/client";
import { SaveLinkInput } from "@/modules/link/schemas";

export type ResolveRedirectDestinationInput = {
  identifier: string;
  context: Context;
};

export type ResolveRedirectDestinationResponse = {
  redirectTo: string;
};

type RedirectorDependencies = {
  getLinkByHashFromCache: typeof getLinkByHashFromCache;
  getLinkByHashOrAlias: typeof getLinkByHashOrAlias;
  saveOrUpdateLinkCache: typeof saveOrUpdateLinkCache;
};

const defaultDependencies: RedirectorDependencies = {
  getLinkByHashFromCache,
  getLinkByHashOrAlias,
  saveOrUpdateLinkCache,
};

type LinkStatus = {
  active: boolean;
  validAt?: string | Date | null;
};

function ensureLinkIsAvailable(link: LinkStatus) {
  if (!link.active) {
    throw new Error(REDIRECTOR_ERRORS_RESPONSE.LINK_NOT_FOUND);
  }

  if (!link.validAt) {
    return;
  }

  const expiresAt =
    typeof link.validAt === "string"
      ? new Date(link.validAt)
      : (link.validAt as Date);

  if (Number.isNaN(expiresAt.getTime())) {
    return;
  }

  if (expiresAt.getTime() <= Date.now()) {
    throw new Error(REDIRECTOR_ERRORS_RESPONSE.LINK_NOT_FOUND);
  }
}

function buildCachePayload(link: Link): SaveLinkInput & { id: string } {
  return {
    id: link.id,
    hash: link.hash,
    alias: link.alias ?? undefined,
    redirectTo: link.redirectTo,
    active: link.active,
    userId: link.userId,
    validAt: link.validAt ? link.validAt.toISOString() : undefined,
    metadata: (link.metadata as SaveLinkInput["metadata"]) ?? undefined,
  };
}

export async function resolveRedirectDestination({
  identifier,
  context,
}: ResolveRedirectDestinationInput,
dependencies: RedirectorDependencies = defaultDependencies
): Promise<ResolveRedirectDestinationResponse> {
  const {
    getLinkByHashFromCache: getCachedLink,
    getLinkByHashOrAlias: getLink,
    saveOrUpdateLinkCache: cacheLink,
  } = dependencies;

  const sanitizedIdentifier = identifier.trim();

  if (!sanitizedIdentifier) {
    throw new Error(REDIRECTOR_ERRORS_RESPONSE.LINK_NOT_FOUND);
  }

  const cachedLink = await getCachedLink(sanitizedIdentifier);

  if (cachedLink) {
    ensureLinkIsAvailable({
      active: cachedLink.active,
      validAt: cachedLink.validAt,
    });

    return { redirectTo: cachedLink.redirectTo };
  }

  const links = await getLink({
    input: { hash: sanitizedIdentifier, alias: sanitizedIdentifier },
    context,
  });

  const [link] = links;

  if (!link) {
    throw new Error(REDIRECTOR_ERRORS_RESPONSE.LINK_NOT_FOUND);
  }

  ensureLinkIsAvailable({
    active: link.active,
    validAt: link.validAt,
  });

  await cacheLink(buildCachePayload(link));

  return { redirectTo: link.redirectTo };
}
