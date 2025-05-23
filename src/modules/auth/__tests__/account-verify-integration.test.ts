import { app } from "@/configurations/app";
import { HTTP_STATUS_CODE } from "@/helpers";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { ACCOUNT_VERIFY_ERRORS, AUTH_ERRORS_RESPONSE } from "../schemas";
import { inject } from "@/tests/app";
import { cache } from "@/infra";

async function fakeApi(fastify: FastifyInstance) {
  fastify.route({
    method: "GET",
    url: "/",
    preHandler: [fastify.isAuthorized, fastify.isAccountVerified],
    handler: (_request: FastifyRequest, reply: FastifyReply) =>
      reply.code(HTTP_STATUS_CODE.OK).send({ ok: "ok" }),
  });
}

const FAKE_API_URL = "api/fake";
app.register(fakeApi, { prefix: FAKE_API_URL });

async function handleRequest({
  isAuthorized = true,
  hasAccountConfirmed,
}: {
  hasAccountConfirmed: boolean;
  isAuthorized?: boolean;
}) {
  if (!hasAccountConfirmed) {
    jest.spyOn(cache, "get").mockResolvedValue("true");
  }

  return await inject({
    method: "GET",
    url: FAKE_API_URL,
    isAuthorized,
  });
}

describe("modules/account-verify-integration", () => {
  it("Should be able to return 401 if account is confirmed but user is not authenticated", async () => {
    const response = await handleRequest({
      hasAccountConfirmed: true,
      isAuthorized: false,
    });

    expect(response.statusCode).toBe(HTTP_STATUS_CODE.UNAUTHORIZED);
    expect(response.json()).toEqual({
      error: AUTH_ERRORS_RESPONSE.TOKEN_NOT_PROVIDED,
    });
  });
  it("Should be able to return 403 if account is not confirmed", async () => {
    const response = await handleRequest({ hasAccountConfirmed: false });

    expect(response.statusCode).toBe(HTTP_STATUS_CODE.FORBIDDEN);
    expect(response.json()).toEqual({
      error: ACCOUNT_VERIFY_ERRORS.NOT_CONFIRMED,
    });
  });

  it("Should be able to return 200 if account is confirmed", async () => {
    const response = await handleRequest({ hasAccountConfirmed: true });

    expect(response.statusCode).toBe(HTTP_STATUS_CODE.OK);
    expect(response.json()).toEqual({
      ok: "ok",
    });
  });
});
