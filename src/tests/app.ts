import { app } from "@/configurations/app";
import { InjectOptions } from "fastify";
import { MOCK_ACCESS_TOKEN, MOCK_REFRESH_TOKEN } from "./jwt";

type InjectType = InjectOptions & {
  isAuthorized?: boolean;
};

export async function inject({ isAuthorized = true, ...rest }: InjectType) {
  let cookies = rest?.cookies;

  if (isAuthorized) {
    cookies = {
      ...cookies,
      access_token: MOCK_ACCESS_TOKEN,
      refresh_token: MOCK_REFRESH_TOKEN,
    };
  }

  return app.inject({ ...rest, cookies });
}
