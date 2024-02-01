import { app } from "@/configurations/app";
import { MOCK_JWT_TOKEN, redis } from "@/tests";
import * as linkService from "../link.service";
import { mockGetAllLinksResponse } from "../__mocks__/get-all";
import {
  mockEditLinkInput,
  mockEditLinkResponse,
} from "../__mocks__/edit-link";
import { faker } from "@faker-js/faker";
import { LINK_ERRORS_RESPONSE } from "../link.schema";
import { mockGetLinkByAliasOrHashResponse } from "../__mocks__/get-by-alias-or-hash";

const BASE_URL = "/api/links";

describe("modules/Link/link-integration", () => {
  describe("Get All", () => {
    it("Should return error if not authenticated", async () => {
      const response = await app.inject({
        method: "GET",
        url: BASE_URL,
      });

      expect(response.json()).toEqual({
        error: "Não autorizado",
      });
      expect(response.statusCode).toEqual(401);
    });

    it("Should be able to return all user links", async () => {
      jest
        .spyOn(linkService, "getAllLinksByUser")
        .mockResolvedValueOnce(mockGetAllLinksResponse);

      const response = await app.inject({
        method: "GET",
        url: BASE_URL,
        headers: { authorization: `Bearer ${MOCK_JWT_TOKEN}` },
      });

      expect(response.json()).toEqual(mockGetAllLinksResponse);
      expect(response.statusCode).toBe(200);
    });

    it("Should be able to return empty array if return nothing", async () => {
      jest.spyOn(linkService, "getAllLinksByUser").mockResolvedValueOnce([]);

      const response = await app.inject({
        method: "GET",
        url: BASE_URL,
        headers: { authorization: `Bearer ${MOCK_JWT_TOKEN}` },
      });

      expect(response.json()).toEqual([]);
      expect(response.statusCode).toBe(200);
    });

    it("Should be able to return a error if anything wrong has happened", async () => {
      jest
        .spyOn(linkService, "getAllLinksByUser")
        .mockRejectedValue(new Error("any error"));

      const response = await app.inject({
        method: "GET",
        url: BASE_URL,
        headers: { authorization: `Bearer ${MOCK_JWT_TOKEN}` },
      });

      expect(response.json()).toEqual({ error: "any error" });
      expect(response.statusCode).toBe(400);
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
      jest.spyOn(linkService, "getLinkByHashOrAlias").mockResolvedValue([]);

      const response = await app.inject({
        method: "PUT",
        url: `${BASE_URL}/not_found`,
        headers: { authorization: `Bearer ${MOCK_JWT_TOKEN}` },
        body: mockEditLinkInput,
      });

      expect(response.statusCode).toEqual(400);
      expect(response.json()).toEqual({
        error: LINK_ERRORS_RESPONSE.LINK_SHORTENER_NOT_EXISTS,
      });
    });

    it("Should be able to return a error if alias already exists", async () => {
      const alias = faker.lorem.word();
      const [firstResponseLinkByAliasOrHash] = mockGetLinkByAliasOrHashResponse;

      jest.spyOn(linkService, "getLinkByHashOrAlias").mockResolvedValue([
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
        error: LINK_ERRORS_RESPONSE.ALIAS_HAS_EXISTS,
      });
    });

    it("Should be able to update a link", async () => {
      const [firstResponseLinkByAliasOrHash] = mockGetLinkByAliasOrHashResponse;

      jest
        .spyOn(linkService, "updateLink")
        .mockResolvedValue(mockEditLinkResponse);
      jest
        .spyOn(linkService, "getLinkByHashOrAlias")
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
