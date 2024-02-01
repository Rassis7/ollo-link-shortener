-- CreateTable
CREATE TABLE "Link" (
    "id" SERIAL NOT NULL,
    "alias" TEXT,
    "hash" TEXT NOT NULL,
    "redirectTo" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "validAt" TIMESTAMP(3) NOT NULL DEFAULT '2023-12-31 23:59:59 +00:00',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Link_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Link_alias_key" ON "Link"("alias");

-- CreateIndex
CREATE UNIQUE INDEX "Link_hash_key" ON "Link"("hash");

-- AddForeignKey
ALTER TABLE "Link" ADD CONSTRAINT "Link_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
