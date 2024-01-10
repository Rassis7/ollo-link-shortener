import { server as app } from "../server";

test("GET /healthcheck route", async () => {
  const response = await app.inject({
    method: "GET",
    url: "/healthcheck",
  });

  expect(response.statusCode).toEqual(200);
  expect(response.json()).toEqual({ status: "OK" });
});
