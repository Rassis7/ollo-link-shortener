import { server } from "@/server";

beforeAll(async () => {
  await server.ready();
});

afterAll(async () => {
  await server.close();
});
