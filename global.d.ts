/* eslint-disable @typescript-eslint/no-unused-vars */
declare global {
  namespace NodeJS {
    export interface ProcessEnv {
      NODE_ENV: "production" | "test" | "development";
      DEBUG_MODE: sring;
      SERVER_PORT: string;
      FASTIFY_COOKIE_DOMAIN: string;
      DATABASE_URL: string;
      FASTIFY_JWT_SECRET: string;
      FASTIFY_PASS_PHRASE: string;
      FASTIFY_JWT_SECRET_EXPIRES_IN: string;
      REDIS_TOKEN_EXPIRE_IN: number;
      FASTIFY_RATE_LIMIT_MAX: string;
      FASTIFY_RATE_LIMIT_TIME_WINDOW: string;
      MAILERSEND_API_KEY: string;
      OLLO_LI_BASE_URL: string;
      INTERNAL_OLLO_LI_BASE_URL: string;
      REDIS_URL: string;
    }
  }
}

import { FastifyInstance } from "fastify";

declare module "fastify" {
  export interface FastifyInstance {
    isAuthorized: any;
    isEmailVerified: any;
  }
}

import { FastifyJWT } from "@fastify/jwt";

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: { id: string };
    user: {
      id: string;
      email: string;
      name: string | null;
    };
  }
}
