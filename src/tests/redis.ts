import { redis } from "@/infra";

afterAll(async () => {
  await redis.quit();
});
