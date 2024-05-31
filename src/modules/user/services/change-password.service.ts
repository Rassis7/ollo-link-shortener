import { CACHE_PREFIX, cache } from "@/infra";
import { CHANGE_PASSWORD_ERROS_RESPONSE } from "../schemas";

export async function getChangePasswordRequestEmail(linkId: string) {
  const restTime = await cache.ttl(CACHE_PREFIX.RECOVERY_PASSWORD, linkId);
  const email = await cache.get<string>(CACHE_PREFIX.RECOVERY_PASSWORD, linkId);

  if (!email) {
    throw new Error(CHANGE_PASSWORD_ERROS_RESPONSE.INVALID_LINK);
  }

  if (restTime <= 1) {
    throw new Error(CHANGE_PASSWORD_ERROS_RESPONSE.LINK_EXPIRED);
  }

  return email;
}

export async function handleInvalidChangePasswordLink(linkId: string) {
  await cache.del(CACHE_PREFIX.RECOVERY_PASSWORD, linkId);
}
