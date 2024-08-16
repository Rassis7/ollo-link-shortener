import {
  CreateUserInput,
  FindUserByEmailResponse,
  FindUserByIdResponse,
} from "../schemas";
import { generateHash } from "@/helpers";
import { Context } from "@/configurations/context";
import { User } from "@prisma/client";
import { CACHE_PREFIX, cache } from "@/infra";

export async function createUser({
  input,
  context,
}: {
  input: CreateUserInput;
  context: Context;
}): Promise<User> {
  const { password, ...rest } = input;

  const hash = await generateHash(password);

  const user = await context.prisma.user.create({
    data: { ...rest, password: hash },
  });

  return user;
}

export async function findUserByEmail({
  email,
  context,
}: {
  email: string;
  context: Context;
}): Promise<FindUserByEmailResponse> {
  return context.prisma.user.findUnique({
    where: { email },
  });
}

export async function findUserById({
  userId,
  context,
}: {
  userId: string;
  context: Context;
}): Promise<FindUserByIdResponse> {
  return context.prisma.user.findUnique({
    where: { id: userId },
  });
}

export async function confirmUserAccount({
  email,
  context,
}: {
  email: string;
  context: Context;
}): Promise<void> {
  const user = await context.prisma.user.update({
    where: { email },
    data: {
      accountConfirmed: true,
    },
  });

  await cache.del(CACHE_PREFIX.ACCOUNT_NOT_CONFIRMED, user.id);
}

export async function changePassword({
  email,
  newPassword,
  context,
}: {
  newPassword: string;
  email: string;
  context: Context;
}) {
  const hash = await generateHash(newPassword);

  return await context.prisma.user.update({
    where: { email },
    data: { password: hash },
  });
}

export async function updateUser({
  user,
  context,
}: {
  user: {
    id: string;
    name?: string;
    email?: string;
    active?: boolean;
  };
  context: Context;
}): Promise<Partial<User> | null> {
  try {
    const { id, ...data } = user;

    return await context.prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        active: true,
        accountConfirmed: true,
      },
    });
  } catch (error) {
    return null;
  }
}
