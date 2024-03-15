import { app } from "@/configurations/app";
import { InjectOptions } from "fastify";
import { createVerifier } from "fast-jwt";
import { MOCK_JWT_TOKEN, SECRET_KEY } from "./jwt";
import * as sessionService from "@/modules/auth/services";

type InjectType = InjectOptions & {
  isAuthorized?: boolean;
};

export async function inject({ isAuthorized = true, ...rest }: InjectType) {
  if (isAuthorized) {
    const verifySync = createVerifier({ key: SECRET_KEY });
    const payload = verifySync(MOCK_JWT_TOKEN);

    if (payload) {
      jest.spyOn(sessionService, "getSession").mockResolvedValue({
        ...payload,
        enabled: true,
        name: "John Due",
        email: "john_due@email.com",
      });
    }
  }

  return app.inject({
    ...rest,
    cookies: {
      ...rest.cookies,
      access_token: MOCK_JWT_TOKEN,
    },
    headers: {
      ...rest.headers,
      authorization: `Bearer ${MOCK_JWT_TOKEN}`,
    },
  });
}
