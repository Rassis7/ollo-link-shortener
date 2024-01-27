import { app } from "@/configurations/app";
import {
  mockLinkToShortenerInput,
  mockSaveLinkResponse,
} from "../__mocks__/save-link";
import { MOCK_JWT_TOKEN, redis } from "@/tests";
import * as shortenerService from "../shortener.service";
import { mockGetLinkByAliasOrHashResponse } from "../__mocks__/get-by-alias-or-hash";
import { faker } from "@faker-js/faker";
import { mockGetLinkByHashFromCacheResponse } from "../__mocks__/get-by-hash";
import { SHORTENER_ERRORS_RESPONSE } from "../shortener.schema";
import { APPLICATION_ERRORS } from "@/helpers";
import {
  mockEditLinkInput,
  mockEditLinkResponse,
} from "../__mocks__/edit-link";

const BASE_URL = "/api/shortener";

function sendWithoutRequiredFields(
  originalObject: Record<string, unknown>,
  attributeName: string
) {
  const { [attributeName]: _omit, ...rest } = originalObject;
  return rest;
}

describe("modules/shortener.integration", () => {
  describe("Save", () => {
    it("Should be able to return a error if not send url field", async () => {
      const dateInPast = faker.date.past();

      const { url, validAt, ...mockLinkToShortenerInputWithError } =
        mockLinkToShortenerInput;
      const response = await app.inject({
        method: "POST",
        url: BASE_URL,
        headers: { authorization: `Bearer ${MOCK_JWT_TOKEN}` },
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
        error: "Não autorizado",
      });
      expect(response.statusCode).toEqual(401);
    });

    it("Should be able to return a error if exists other link with same hash", async () => {
      const hash = "123";
      jest.spyOn(shortenerService, "generateUrlHash").mockReturnValue(hash);

      const [firstLink] = mockGetLinkByAliasOrHashResponse;

      jest
        .spyOn(shortenerService, "getLinkByHashOrAlias")
        .mockResolvedValue([{ ...firstLink, hash }]);

      const response = await app.inject({
        method: "POST",
        url: BASE_URL,
        body: mockLinkToShortenerInput,
        headers: { authorization: `Bearer ${MOCK_JWT_TOKEN}` },
      });

      expect(response.json()).toEqual({
        error: APPLICATION_ERRORS.INTERNAL_ERROR,
      });
      expect(response.statusCode).toEqual(400);
    });

    it("Should be able to return a error if exists other link with same alias", async () => {
      const alias = faker.lorem.word();

      const [firstLink] = mockGetLinkByAliasOrHashResponse;

      jest
        .spyOn(shortenerService, "getLinkByHashOrAlias")
        .mockResolvedValue([{ ...firstLink, alias }]);

      const response = await app.inject({
        method: "POST",
        url: BASE_URL,
        body: { ...mockLinkToShortenerInput, alias },
        headers: { authorization: `Bearer ${MOCK_JWT_TOKEN}` },
      });

      expect(response.json()).toEqual({
        error: SHORTENER_ERRORS_RESPONSE.ALIAS_HAS_EXISTS,
      });
      expect(response.statusCode).toEqual(400);
    });

    it("Should be able to return error if save in cache and already exists that hash", async () => {
      jest
        .spyOn(shortenerService, "getLinkByHashOrAlias")
        .mockResolvedValue([]);
      jest
        .spyOn(redis, "get")
        .mockResolvedValue(JSON.stringify(mockGetLinkByHashFromCacheResponse));

      const response = await app.inject({
        method: "POST",
        url: BASE_URL,
        body: mockLinkToShortenerInput,
        headers: { authorization: `Bearer ${MOCK_JWT_TOKEN}` },
      });

      expect(response.json()).toEqual({
        error: SHORTENER_ERRORS_RESPONSE.URL_HAS_EXISTS,
      });
      expect(response.statusCode).toEqual(400);
    });

    it("Should be able to shortener link", async () => {
      jest
        .spyOn(shortenerService, "getLinkByHashOrAlias")
        .mockResolvedValue([]);
      jest.spyOn(shortenerService, "saveOrUpdateLinkCache").mockResolvedValue();
      jest
        .spyOn(shortenerService, "shortenerLink")
        .mockResolvedValue(mockSaveLinkResponse);

      const response = await app.inject({
        method: "POST",
        url: BASE_URL,
        body: mockLinkToShortenerInput,
        headers: { authorization: `Bearer ${MOCK_JWT_TOKEN}` },
      });

      expect(response.json()).toEqual({
        shortLink: `https://ollo.li/${mockLinkToShortenerInput.alias}`,
      });
      expect(response.statusCode).toBe(201);
    });

    it("Should be able to response new shortener url with hash", async () => {
      const hash = "123";

      jest.spyOn(shortenerService, "generateUrlHash").mockReturnValue(hash);
      jest
        .spyOn(shortenerService, "getLinkByHashOrAlias")
        .mockResolvedValue([]);
      jest.spyOn(shortenerService, "saveOrUpdateLinkCache").mockResolvedValue();
      jest
        .spyOn(shortenerService, "shortenerLink")
        .mockResolvedValue(mockSaveLinkResponse);

      const { alias: _alias, ...mockLinkToShortenerInputWithoutAlias } =
        mockLinkToShortenerInput;

      const response = await app.inject({
        method: "POST",
        url: BASE_URL,
        body: mockLinkToShortenerInputWithoutAlias,
        headers: { authorization: `Bearer ${MOCK_JWT_TOKEN}` },
      });

      expect(response.json()).toEqual({
        shortLink: `https://ollo.li/${hash}`,
      });
      expect(response.statusCode).toBe(201);
    });
  });

  describe("Update", () => {
    it("Should be able to return a error if not be unauthorized", async () => {
      const response = await app.inject({
        method: "PUT",
        url: `${BASE_URL}/not_found`,
        body: mockEditLinkInput,
      });

      expect(response.json()).toEqual({
        error: "Não autorizado",
      });
      expect(response.statusCode).toEqual(401);
    });

    it("Should be able to return a error if link not exists", async () => {
      jest
        .spyOn(shortenerService, "getLinkByHashOrAlias")
        .mockResolvedValue([]);

      const response = await app.inject({
        method: "PUT",
        url: `${BASE_URL}/not_found`,
        headers: { authorization: `Bearer ${MOCK_JWT_TOKEN}` },
        body: mockEditLinkInput,
      });

      expect(response.statusCode).toEqual(400);
      expect(response.json()).toEqual({
        error: SHORTENER_ERRORS_RESPONSE.LINK_SHORTENER_NOT_EXISTS,
      });
    });

    it("Should be able to return a error if alias already exists", async () => {
      const alias = faker.lorem.word();
      const [firstResponseLinkByAliasOrHash] = mockGetLinkByAliasOrHashResponse;

      jest.spyOn(shortenerService, "getLinkByHashOrAlias").mockResolvedValue([
        {
          ...firstResponseLinkByAliasOrHash,
          id: faker.string.uuid(),
          alias,
        },
      ]);

      const response = await app.inject({
        method: "PUT",
        url: `${BASE_URL}/${firstResponseLinkByAliasOrHash.id}`,
        headers: { authorization: `Bearer ${MOCK_JWT_TOKEN}` },
        body: { ...mockEditLinkInput, alias },
      });

      expect(response.statusCode).toEqual(400);
      expect(response.json()).toEqual({
        error: SHORTENER_ERRORS_RESPONSE.ALIAS_HAS_EXISTS,
      });
    });

    it("Should be able to update a link", async () => {
      const [firstResponseLinkByAliasOrHash] = mockGetLinkByAliasOrHashResponse;

      jest
        .spyOn(shortenerService, "updateLink")
        .mockResolvedValue(mockEditLinkResponse);
      jest
        .spyOn(shortenerService, "getLinkByHashOrAlias")
        .mockResolvedValue([firstResponseLinkByAliasOrHash]);
      jest.spyOn(redis, "set");
      jest.spyOn(redis, "expire");

      const response = await app.inject({
        method: "PUT",
        url: `${BASE_URL}/${firstResponseLinkByAliasOrHash.id}`,
        headers: { authorization: `Bearer ${MOCK_JWT_TOKEN}` },
        body: { ...mockEditLinkInput },
      });

      expect(response.statusCode).toEqual(200);
      expect(response.json()).toEqual({
        redirectTo: mockEditLinkResponse.redirectTo,
        active: mockEditLinkResponse.active,
        validAt: mockEditLinkResponse.validAt?.toISOString(),
        metadata: mockEditLinkResponse.metadata,
        alias: mockEditLinkResponse.alias,
        hash: mockEditLinkResponse.hash,
      });
    });
  });
});
