import { app } from "@/configurations/app";
import {
  mockLinkToShortenerInput,
  mockSaveLinkResponse,
} from "../__mocks__/save-link";
import { cache } from "@/tests";
import * as shortenerService from "../services/shortener.service";
import { mockGetLinkByAliasOrHashResponse } from "../__mocks__/get-by-alias-or-hash";
import { faker } from "@faker-js/faker";
import { mockGetLinkByHashFromCacheResponse } from "../__mocks__/get-by-hash";
import { SHORTENER_ERRORS_RESPONSE } from "../schemas/shortener.schema";
import { APPLICATION_ERRORS } from "@/helpers";
import * as linkService from "../services/link.service";
import { inject } from "@/tests/app";
import { createHash } from "node:crypto";
import { AUTH_ERRORS_RESPONSE } from "@/modules/auth/schemas/auth.schema";

const BASE_URL = "/api/links/shortener";

describe("modules/shortener.integration", () => {
  it("Should be able to return a error if not send url field", async () => {
    const dateInPast = faker.date.past();

    const {
      url: _url,
      validAt: _validAt,
      ...mockLinkToShortenerInputWithError
    } = mockLinkToShortenerInput;

    const response = await inject({
      method: "POST",
      url: BASE_URL,
      body: { ...mockLinkToShortenerInputWithError, validAt: dateInPast },
    });

    expect(response.json()).toEqual({
      error: {
        url: {
          code: "invalid_type",
          message: "A url é obrigatória",
          typeError: {
            expected: "string",
            received: "undefined",
          },
        },
        validAt: {
          code: "custom",
          message: "A data de validade deve ser maior que hoje!",
        },
      },
    });
    expect(response.statusCode).toEqual(400);
  });

  it("Should be able to return a error if user not authenticated", async () => {
    const response = await app.inject({
      method: "POST",
      url: BASE_URL,
      body: mockLinkToShortenerInput,
    });

    expect(response.json()).toEqual({
      error: AUTH_ERRORS_RESPONSE.TOKEN_NOT_PROVIDED,
    });
    expect(response.statusCode).toEqual(401);
  });

  it("Should be able to return a error if exists other link with same hash", async () => {
    const hash = "123";
    jest.spyOn(shortenerService, "generateUrlHash").mockReturnValue(hash);

    const [firstLink] = mockGetLinkByAliasOrHashResponse;

    jest
      .spyOn(linkService, "getLinkByHashOrAlias")
      .mockResolvedValue([{ ...firstLink, hash }]);

    const response = await inject({
      method: "POST",
      url: BASE_URL,
      body: mockLinkToShortenerInput,
    });

    expect(response.json()).toEqual({
      error: APPLICATION_ERRORS.INTERNAL_ERROR,
    });
    expect(response.statusCode).toEqual(400);
  });

  it("Should be able to return a error if exists other link with same alias", async () => {
    (createHash as jest.Mock).mockReturnValue({
      update: jest.fn().mockReturnThis(),
      digest: jest.fn().mockReturnValue(Buffer.from("0123456789", "hex")),
    });

    const alias = faker.lorem.word();

    const [firstLink] = mockGetLinkByAliasOrHashResponse;

    jest
      .spyOn(linkService, "getLinkByHashOrAlias")
      .mockResolvedValue([{ ...firstLink, alias }]);

    const response = await inject({
      method: "POST",
      url: BASE_URL,
      body: { ...mockLinkToShortenerInput, alias },
    });

    expect(response.json()).toEqual({
      error: SHORTENER_ERRORS_RESPONSE.ALIAS_HAS_EXISTS,
    });
    expect(response.statusCode).toEqual(400);
  });

  it("Should be able to return error if save in cache and already exists that hash", async () => {
    jest.spyOn(linkService, "getLinkByHashOrAlias").mockResolvedValue([]);
    jest
      .spyOn(cache, "get")
      .mockResolvedValue(JSON.stringify(mockGetLinkByHashFromCacheResponse));

    const response = await inject({
      method: "POST",
      url: BASE_URL,
      body: mockLinkToShortenerInput,
    });

    expect(response.json()).toEqual({
      error: SHORTENER_ERRORS_RESPONSE.URL_HAS_EXISTS,
    });
    expect(response.statusCode).toEqual(400);
  });

  it("Should be able to shortener link", async () => {
    jest.spyOn(linkService, "getLinkByHashOrAlias").mockResolvedValue([]);
    jest.spyOn(linkService, "saveOrUpdateLinkCache").mockResolvedValue();
    jest
      .spyOn(shortenerService, "shortenerLink")
      .mockResolvedValue(mockSaveLinkResponse);

    const response = await inject({
      method: "POST",
      url: BASE_URL,
      body: mockLinkToShortenerInput,
    });

    expect(response.json()).toEqual({
      shortLink: `https://ollo.li/${mockLinkToShortenerInput.alias}`,
    });
    expect(response.statusCode).toBe(201);
  });

  it("Should be able to response new shortener url with hash", async () => {
    const hash = "123";

    jest.spyOn(shortenerService, "generateUrlHash").mockReturnValue(hash);
    jest.spyOn(linkService, "getLinkByHashOrAlias").mockResolvedValue([]);
    jest.spyOn(linkService, "saveOrUpdateLinkCache").mockResolvedValue();
    jest
      .spyOn(shortenerService, "shortenerLink")
      .mockResolvedValue(mockSaveLinkResponse);

    const { alias: _alias, ...mockLinkToShortenerInputWithoutAlias } =
      mockLinkToShortenerInput;

    const response = await inject({
      method: "POST",
      url: BASE_URL,
      body: mockLinkToShortenerInputWithoutAlias,
    });

    expect(response.json()).toEqual({
      shortLink: `https://ollo.li/${hash}`,
    });
    expect(response.statusCode).toBe(201);
  });
});
