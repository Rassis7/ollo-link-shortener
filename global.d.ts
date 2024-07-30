/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
declare global {
  namespace NodeJS {
    export interface ProcessEnv {
      NODE_ENV: "production" | "test" | "development";
      DEBUG_MODE: string;
      SERVER_PORT: string;
      FASTIFY_COOKIE_DOMAIN: string;
      DATABASE_URL: string;
      FASTIFY_JWT_SECRET_ACCESS_TOKEN: string;
      FASTIFY_JWT_ACCESS_TOKEN_EXPIRES_IN: string;
      FASTIFY_JWT_SECRET_REFRESH_TOKEN: string;
      FASTIFY_JWT_REFRESH_TOKEN_EXPIRES_IN: string;
      FASTIFY_PASS_PHRASE: string;
      REDIS_TOKEN_EXPIRE_IN: number;
      FASTIFY_RATE_LIMIT_MAX: string;
      FASTIFY_RATE_LIMIT_TIME_WINDOW: string;
      MAILERSEND_API_KEY: string;
      OLLO_LI_BASE_URL: string;
      INTERNAL_OLLO_LI_BASE_URL: string;
      REDIS_URL: string;
      SUPABASE_URL: string;
      SUPABASE_KEY: string;
      SUPABASE_DEFAULT_LINK_BUCKET: string;
    }
  }
}

import { FastifyInstance, preHandlerHookHandler } from "fastify";
import fastifyJwt, { FastifyJwtNamespace, JWT } from "@fastify/jwt";
declare module "fastify" {
  interface FastifyInstance
    extends FastifyJwtNamespace<{
      namespace: "accessToken" | "refreshToken";
    }> {
    isAuthorized: any;
    isAccountVerified: any;
    verifyAccessToken: any;
  }

  interface FastifyRequest {
    jwt: FastifyJWT;
    cookies: {
      access_token: string;
      refresh_token: string;
    };
  }
}

declare module "@fastify/jwt" {
  interface JWT extends Pick<JWT, "accessToken" | "refreshToken"> {
    accessToken: Omit<FastifyInstance["jwt"], "accessToken" | "refreshToken">;
    refreshToken: Omit<FastifyInstance["jwt"], "accessToken" | "refreshToken">;
  }
}

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload?: {
      id?: string;
      name?: string | null;
    };
    user: {
      id: string;
      name?: string | null;
      accountNotConfirmed?: boolean | null;
    };
  }
}
