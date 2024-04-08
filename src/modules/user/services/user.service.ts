import {
  CreateUserInput,
  FindUserByEmailResponse,
  FindUserByIdResponse,
} from "../schemas";
import { generateHash } from "@/helpers";
import { Context } from "@/configurations/context";
import { User } from "@prisma/client";

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
}): Promise<User> {
  return await context.prisma.user.update({
    where: { email },
    data: {
      accountConfirmed: true,
    },
  });
}
