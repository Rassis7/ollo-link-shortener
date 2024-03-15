import { cache } from "@/infra";

afterAll(async () => {
  await cache.quit();
});

export { cache };
