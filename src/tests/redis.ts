import { Cache } from "@/infra";

afterAll(async () => {
  await Cache.quit();
});

export { Cache };
