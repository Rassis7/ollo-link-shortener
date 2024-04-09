import { app } from "@/configurations/app";
import { ErrorHandler, HTTP_STATUS_CODE } from "@/helpers";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import {
  MOCK_ACCESS_TOKEN,
  MOCK_REFRESH_TOKEN,
  MOCK_USER_ID,
  MOCK_USER_NAME,
} from "@/tests";
import { AUTH_ERRORS_RESPONSE, cookiesProps } from "../schemas";
import * as userServices from "@/modules/user/services/user.service";
import { mockFindUserByIdResponse } from "@/modules/user/__mocks__/find-user-by-email";
import { inject } from "@/tests/app";

let mockRequestUser = {};

async function fakeApi(fastify: FastifyInstance) {
  fastify.route({
    method: "GET",
    url: "/",
    preHandler: [fastify.isAuthorized],
    handler: (request: FastifyRequest, reply: FastifyReply) => {
      try {
        mockRequestUser = request.user;
        return reply.code(HTTP_STATUS_CODE.OK).send({ ok: "ok" });
      } catch (e) {
        const error = new ErrorHandler(e);
        return reply.code(HTTP_STATUS_CODE.BAD_REQUEST).send(error);
      }
    },
  });
}
const FAKE_API_URL = "api/fake";
app.register(fakeApi, { prefix: FAKE_API_URL });

async function handleRequest({
  accessToken,
  refreshToken,
}: {
  accessToken: string;
  refreshToken?: string;
}) {
  return app.inject({
    method: "GET",
    url: FAKE_API_URL,
    cookies: refreshToken
      ? { access_token: accessToken, refresh_token: refreshToken }
      : { access_token: accessToken },
  });
}

describe("modules/authorization-integration.token", () => {
  it("Should be able to validate routes with access token", async () => {
    const response = await handleRequest({ accessToken: MOCK_ACCESS_TOKEN });

    expect(response.statusCode).toBe(HTTP_STATUS_CODE.OK);
    expect(response.json()).toEqual({ ok: "ok" });
    expect(mockRequestUser).toEqual({
      id: MOCK_USER_ID,
      name: MOCK_USER_NAME,
      accountNotConfirmed: false,
    });
  });

  it("If access token is invalid and refresh token is invalid, should be to return 401", async () => {
    const response = await handleRequest({
      accessToken: "any_token",
      refreshToken: "any_token",
    });

    expect(response.statusCode).toBe(HTTP_STATUS_CODE.UNAUTHORIZED);
    expect(response.json()).toEqual({
      error: AUTH_ERRORS_RESPONSE.NOT_AUTHORIZED,
    });
  });
});

describe("modules/authorization-integration.refresh", () => {
  it("If access token is invalid and refresh token is valid, should be to new access token", async () => {
    jest
      .spyOn(userServices, "findUserById")
      .mockResolvedValue(mockFindUserByIdResponse);

    const response = await handleRequest({
      accessToken: "any_token",
      refreshToken: MOCK_REFRESH_TOKEN,
    });

    expect(response.statusCode).toBe(HTTP_STATUS_CODE.OK);

    const { domain: _, ...cookiesWithoutDomain } = cookiesProps;

    expect(response.cookies).toEqual([
      {
        ...cookiesWithoutDomain,
        sameSite: "Strict",
        name: "access_token",
        value: expect.anything(),
      },
    ]);
  });

  it("Should be able to generate new refresh token", async () => {
    const response = await inject({
      method: "POST",
      url: "api/auth/refreshToken",
      isAuthorized: true,
    });

    const { domain: _, ...cookiesWithoutDomain } = cookiesProps;

    expect(response.cookies).toEqual([
      {
        ...cookiesWithoutDomain,
        sameSite: "Strict",
        name: "access_token",
        value: MOCK_ACCESS_TOKEN,
      },
      {
        ...cookiesWithoutDomain,
        sameSite: "Strict",
        name: "refresh_token",
        value: MOCK_REFRESH_TOKEN,
      },
    ]);
    expect(response.statusCode).toEqual(HTTP_STATUS_CODE.NO_CONTENT);
  });
});
