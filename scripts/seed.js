/* eslint-disable @typescript-eslint/no-var-requires */
const dotenv = require("dotenv");
const { resolve } = require("node:path");

dotenv.config({
  path: resolve(__dirname, "..", `.env.${process.env.NODE_ENV}`),
});

const { PrismaClient } = require("@prisma/client");

const { faker } = require("@faker-js/faker");

const prisma = new PrismaClient();

async function main() {
  await prisma.$connect();

  const user = await prisma.user.create({
    data: {
      email: "jhondue@email.com",
      name: "Jhon Doe",
      password: "$2b$10$GstlEiiaFOAVhKCg.OhPR.wtovvLuE3au6votU5vV2zh8XTlkbS.e",
      createdAt: new Date(),
      accountConfirmed: false,
    },
  });

  for await (let _ of new Array(20).fill(true)) {
    await prisma.link.create({
      data: {
        redirectTo: faker.internet.url(),
        alias: faker.lorem.word(),
        hash: faker.string.alphanumeric(8),
        active: faker.datatype.boolean(),
        validAt: faker.date.future(),
        createdAt: faker.date.past(),
        userId: user.id,
        metadata: {
          title: faker.lorem.words(2),
          description: faker.lorem.words(5),
          photo: faker.image.url(),
        },
      },
    });
  }
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
