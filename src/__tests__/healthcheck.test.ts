import supertest from "supertest";
import { server as app } from "../server";

test("GET `/healthcheck` route", async () => {
  await app.ready();

  const response = await supertest(app.server)
    .get("/healthcheck")
    .expect(200)
    .expect("Content-Type", "application/json; charset=utf-8");

  expect(response.body).toEqual({ status: "OK" });
});
