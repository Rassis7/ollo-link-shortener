import { server } from "@/server";

beforeEach(async () => {
  await server.ready();
});

afterEach(async () => {
  await server.close();
});
