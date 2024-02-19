/*
  Warnings:

  - You are about to drop the `Using` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Using" DROP CONSTRAINT "Using_stackId_fkey";

-- DropForeignKey
ALTER TABLE "Using" DROP CONSTRAINT "Using_userId_fkey";

-- DropTable
DROP TABLE "Using";

-- CreateTable
CREATE TABLE "_UserStacks" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_UserStacks_AB_unique" ON "_UserStacks"("A", "B");

-- CreateIndex
CREATE INDEX "_UserStacks_B_index" ON "_UserStacks"("B");

-- AddForeignKey
ALTER TABLE "_UserStacks" ADD CONSTRAINT "_UserStacks_A_fkey" FOREIGN KEY ("A") REFERENCES "Stack"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserStacks" ADD CONSTRAINT "_UserStacks_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
