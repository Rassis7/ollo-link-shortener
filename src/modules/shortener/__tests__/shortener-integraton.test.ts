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

const BASE_URL = "/api/shortener";

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
        error: "Ocorreu um erro, por favor tente novamente",
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
        error: "Já existe um link com esse nome personalizado",
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
        error: "A url informada já existe",
      });
      expect(response.statusCode).toEqual(400);
    });

    it("Should be able to shortener link", async () => {
      jest
        .spyOn(shortenerService, "getLinkByHashOrAlias")
        .mockResolvedValue([]);
      jest.spyOn(shortenerService, "shortenerLinkCache").mockResolvedValue();
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
      jest.spyOn(shortenerService, "shortenerLinkCache").mockResolvedValue();
      jest
        .spyOn(shortenerService, "shortenerLink")
        .mockResolvedValue(mockSaveLinkResponse);

      const { alias, ...mockLinkToShortenerInputWithoutAlias } =
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
});
