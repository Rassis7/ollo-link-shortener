import { inject } from "@/tests/app";
import { HTTP_STATUS_CODE } from "@/helpers";
import { faker } from "@faker-js/faker";
import { mockGetRedirectLinkValuesResponse } from "@/modules/link/__mocks__/get-redirect-link";
import * as redirectorService from "../services/redirector.service";
import { REDIRECTOR_ERRORS_RESPONSE } from "../schemas";

const BASE_URL = "/r";

describe("modules/redirector.routes", () => {
  it("should redirect the visitor to the original url when hash exists", async () => {
    const hash = faker.string.alphanumeric(8);
    const destination = mockGetRedirectLinkValuesResponse.redirectTo;

    const resolveRedirectDestinationSpy = jest
      .spyOn(redirectorService, "resolveRedirectDestination")
      .mockResolvedValue({ redirectTo: destination });

    const response = await inject({
      method: "GET",
      url: `${BASE_URL}/${hash}`,
      isAuthorized: false,
    });

    expect(resolveRedirectDestinationSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        identifier: hash,
        context: expect.anything(),
      })
    );

    expect(response.statusCode).toBe(HTTP_STATUS_CODE.MOVED_PERMANENTLY);
    expect(response.headers.location).toBe(destination);
  });

  it("should return 404 when the short link does not exist", async () => {
    const hash = faker.string.alphanumeric(8);

    jest
      .spyOn(redirectorService, "resolveRedirectDestination")
      .mockRejectedValue(new Error(REDIRECTOR_ERRORS_RESPONSE.LINK_NOT_FOUND));

    const response = await inject({
      method: "GET",
      url: `${BASE_URL}/${hash}`,
      isAuthorized: false,
    });

    expect(response.statusCode).toBe(HTTP_STATUS_CODE.NOT_FOUND);
    expect(response.json()).toEqual({
      error: REDIRECTOR_ERRORS_RESPONSE.LINK_NOT_FOUND,
    });
  });

  it("should return 500 when an unexpected error happens", async () => {
    const hash = faker.string.alphanumeric(8);
    const errorMessage = "internal failure";

    jest
      .spyOn(redirectorService, "resolveRedirectDestination")
      .mockRejectedValue(new Error(errorMessage));

    const response = await inject({
      method: "GET",
      url: `${BASE_URL}/${hash}`,
      isAuthorized: false,
    });

    expect(response.statusCode).toBe(
      HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR
    );
    expect(response.json()).toEqual({ error: errorMessage });
  });
});
