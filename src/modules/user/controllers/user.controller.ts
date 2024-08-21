import { FastifyReply, FastifyRequest } from "fastify";
import {
  createUser,
  findUserByEmail,
  findUserById,
  updateUser,
} from "../services";
import {
  CreateUserInput,
  UpdateUserInput,
  USER_ERRORS_RESPONSE,
} from "../schemas";
import { sendVerifyEmailHandler } from "../../email/services";
import { ErrorHandler, HTTP_STATUS_CODE } from "@/helpers";
import { CACHE_PREFIX, cache, prisma } from "@/infra";

type RegisterUserHandlerRequestProps = FastifyRequest<{
  Body: CreateUserInput;
}>;

export async function registerUserHandler(
  request: RegisterUserHandlerRequestProps,
  reply: FastifyReply
) {
  try {
    const { body } = request;

    const hasUser = await findUserByEmail({
      email: body.email,
      context: { prisma },
    });

    if (hasUser) {
      throw new Error(USER_ERRORS_RESPONSE.EMAIL_ALREADY_EXISTS);
    }

    const user = await createUser({ input: body, context: { prisma } });
    try {
      await sendVerifyEmailHandler(user.email);
      await cache.set(CACHE_PREFIX.ACCOUNT_NOT_CONFIRMED, user.id, "true");
    } catch (error) {
      // TODO: handle error and set resend email
      // logger.error(error);
    }

    return reply.code(HTTP_STATUS_CODE.CREATED).send(user);
  } catch (e) {
    const error = new ErrorHandler(e);
    return reply.code(HTTP_STATUS_CODE.BAD_REQUEST).send(error);
  }
}

export async function findUserByIdHandler(
  request: FastifyRequest<{
    Params: {
      userId: string;
    };
  }>,
  reply: FastifyReply
) {
  try {
    const { userId } = request.params;

    const user = await findUserById({ userId, context: { prisma } });

    if (!user) {
      throw new Error(USER_ERRORS_RESPONSE.USER_NOT_FOUND);
    }

    const { password: _, ...userResponse } = user;

    return reply.send(userResponse);
  } catch (e) {
    const error = new ErrorHandler(e);
    return reply.code(HTTP_STATUS_CODE.BAD_REQUEST).send(error);
  }
}

type UpdateUserHandlerRequestProps = FastifyRequest<{
  Body: UpdateUserInput;
  Params: {
    userId: string;
  };
}>;

export async function updateUserHandler(
  request: UpdateUserHandlerRequestProps,
  reply: FastifyReply
) {
  try {
    const { params, body } = request;

    const user = await updateUser({
      user: { id: params.userId, ...body },
      context: { prisma },
    });

    if (!user?.id) {
      throw new Error(USER_ERRORS_RESPONSE.USER_NOT_FOUND);
    }

    return reply.code(HTTP_STATUS_CODE.OK).send({ id: user.id });
  } catch (e) {
    const error = new ErrorHandler(e);
    return reply.code(HTTP_STATUS_CODE.BAD_REQUEST).send(error);
  }
}
