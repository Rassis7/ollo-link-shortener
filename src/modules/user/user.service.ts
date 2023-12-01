import { prisma } from "@/infra";
import { CreateUserInput } from "./user.schema";
import { generateHash } from "@/helpers";

export async function createUser(input: CreateUserInput) {
  const { password, ...rest } = input;

  const hash = await generateHash(password);

  const user = await prisma.user.create({
    data: { ...rest, password: hash },
  });

  return user;
}

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: {
      email,
    },
  });
}

export async function findUsers() {
  return prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
    },
  });
}
