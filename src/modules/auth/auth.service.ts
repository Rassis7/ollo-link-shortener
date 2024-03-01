import { CACHE_PREFIX, Cache } from "@/infra";
import { GenerateSessionProps, SessionProps } from "./auth.schema";

export async function generateSession({ id, ...rest }: GenerateSessionProps) {
  const session = await getSession(id);
  if (session) {
    return session;
  }

  await Cache.set(
    CACHE_PREFIX.AUTH,
    id,
    { id, enabled: true, ...rest },
    process.env.REDIS_TOKEN_EXPIRE_IN
  );
}

export async function getSession(hash: string): Promise<SessionProps | null> {
  const restTime = await Cache.ttl(CACHE_PREFIX.AUTH, hash);

  if (restTime <= 1) {
    return null;
  }

  return Cache.get<SessionProps>(CACHE_PREFIX.AUTH, hash);
}
