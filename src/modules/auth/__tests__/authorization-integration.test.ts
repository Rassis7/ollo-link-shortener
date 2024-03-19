import { app } from "@/configurations/app";
import { ErrorHandler, HTTP_STATUS_CODE } from "@/helpers";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import { faker } from "@faker-js/faker";
import { createSigner } from "fast-jwt";
import { AUTH_ERRORS_RESPONSE } from "@/modules/auth/schemas";
import * as sessionService from "@/modules/auth/services/session.service";
import { SessionProps } from "../schemas";
import { MOCK_JWT_TOKEN } from "@/tests";
import { mockSession } from "../__mocks__/session";

let mockRequestObject = {} as FastifyRequest;

async function fakeApi(fastify: FastifyInstance) {
  fastify.route({
    method: "GET",
    url: "/",
    preHandler: [fastify.isAuthorized],
    handler: (request: FastifyRequest, reply: FastifyReply) => {
      try {
        mockRequestObject = request;
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

async function handleRequest(token?: string) {
  const cookies = { access_token: token ?? "" };
  const headers = token ? { authorization: `Bearer ${token}` } : {};

  return await app.inject({
    method: "GET",
    url: FAKE_API_URL,
    cookies,
    headers,
  });
}

const signJWTSync = ({ key }: { key: string }) =>
  createSigner({
    key,
    expiresIn: process.env.FASTIFY_JWT_SECRET_EXPIRES_IN,
  });

describe("modules/session-integration", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("Should be able to return an error if not exists access_token cookie", async () => {
    const response = await handleRequest();

    expect(response.statusCode).toBe(HTTP_STATUS_CODE.UNAUTHORIZED);
    expect(response.json()).toEqual({
      error: AUTH_ERRORS_RESPONSE.TOKEN_NOT_PROVIDED,
    });
  });

  it("Should be able to return an error if is not possible decoded the token", async () => {
    const generateTokenFn = signJWTSync({ key: faker.string.alphanumeric() });
    const wrongToken = generateTokenFn({
      id: faker.string.uuid(),
    });

    const response = await handleRequest(wrongToken);

    expect(response.statusCode).toBe(HTTP_STATUS_CODE.UNAUTHORIZED);
    expect(response.json()).toEqual({
      error: AUTH_ERRORS_RESPONSE.TOKEN_INVALID,
    });
  });

  it("Should be able to return an erro if session not exists", async () => {
    jest
      .spyOn(sessionService, "getSession")
      .mockResolvedValue(Promise.resolve({} as SessionProps));

    const response = await handleRequest(MOCK_JWT_TOKEN);

    expect(response.statusCode).toBe(HTTP_STATUS_CODE.UNAUTHORIZED);
    expect(response.json()).toEqual({
      error: AUTH_ERRORS_RESPONSE.NOT_AUTHORIZED,
    });
  });

  it("Should be able to return an erro if session is disabled", async () => {
    jest.spyOn(sessionService, "getSession").mockResolvedValue(
      Promise.resolve({
        ...mockSession,
        enabled: false,
      } as SessionProps)
    );

    const response = await handleRequest(MOCK_JWT_TOKEN);

    expect(response.statusCode).toBe(HTTP_STATUS_CODE.UNAUTHORIZED);
    expect(response.json()).toEqual({
      error: AUTH_ERRORS_RESPONSE.NOT_AUTHORIZED,
    });
  });

  it("Should be able to create an user into request object", async () => {
    jest
      .spyOn(sessionService, "getSession")
      .mockResolvedValue(Promise.resolve(mockSession as SessionProps));

    const response = await handleRequest(MOCK_JWT_TOKEN);

    expect(response.statusCode).toBe(HTTP_STATUS_CODE.OK);
    expect(mockRequestObject.user).toEqual({
      id: mockSession.id,
      name: mockSession.name,
      email: mockSession.email,
      accountConfirmed: false,
    });
  });

  it("If token is expired, should generate a new session, to add into request and save the cookie", async () => {
    jest
      .spyOn(sessionService, "getSession")
      .mockResolvedValue(Promise.resolve(mockSession as SessionProps));
    jest.spyOn(sessionService, "generateSession");

    const generateTokenFn = signJWTSync({
      key: process.env.FASTIFY_JWT_SECRET,
    });
    const tokenInPass = generateTokenFn({
      id: mockSession.id,
      iat: Math.floor(Date.now() / 1000) - 3600, // Emitido há 1 hora
      exp: Math.floor(Date.now() / 1000) - 1800, // Expirou há 30 minutos
    });

    const response = await handleRequest(tokenInPass);

    expect(sessionService.generateSession).toHaveBeenCalledTimes(1);
    expect(sessionService.generateSession).toHaveBeenCalledWith(mockSession);

    expect(mockRequestObject.user).toEqual({
      id: mockSession.id,
      name: mockSession.name,
      email: mockSession.email,
      accountConfirmed: false,
    });

    const token = app.jwt.sign({ id: mockSession.id });

    expect(response.cookies).toEqual([
      {
        domain: "ollo.li",
        name: "access_token",
        path: "/",
        secure: true,
        value: token,
      },
    ]);
  });
});
