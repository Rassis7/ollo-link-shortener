import { app } from "@/configurations/app";
import { mockLinkToShortenerInput } from "../__mocks__/save-link";

const BASE_URL = "/api/shortener";

describe("modules/shortener.integration", () => {
  it("Should be able to return a error if not send url field", async () => {
    const { url, ...body } = mockLinkToShortenerInput;
    const response = await app.inject({
      method: "POST",
      url: BASE_URL,
      body,
    });

    expect(response.json()).toEqual({
      message: ["A url é obrigatória"],
    });
  });

  it.todo(
    "Should return error if exists other link with same %s (hash or alias)"
  );
  it.todo("Should be able to shortener link and save in cache");
  it.todo(
    "Should be able to response new shortener url with %s(alias or hash)"
  );
});
