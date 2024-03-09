import { CACHE_PREFIX, cache } from "@/infra";
import { GenerateSessionProps, SessionProps } from "./auth.schema";

export async function generateSession({ id, ...rest }: GenerateSessionProps) {
  await cache.set(
    CACHE_PREFIX.AUTH,
    id,
    { id, enabled: true, ...rest },
    process.env.REDIS_TOKEN_EXPIRE_IN
  );
}

export async function getSession(hash: string): Promise<SessionProps | null> {
  const restTime = await cache.ttl(CACHE_PREFIX.AUTH, hash);

  if (restTime <= 1) {
    return null;
  }

  return cache.get<SessionProps>(CACHE_PREFIX.AUTH, hash);
}
