import { app } from "@/configurations/app";
import { MOCK_JWT_TOKEN } from "@/tests";
import * as linkService from "../link.service";
import { mockGetAllLinksResponse } from "../__mocks__/get-all";

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
});
