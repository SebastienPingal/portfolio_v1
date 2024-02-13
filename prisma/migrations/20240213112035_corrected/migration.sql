/*
  Warnings:

  - You are about to drop the `StackOnPost` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "StackOnPost" DROP CONSTRAINT "StackOnPost_postId_fkey";

-- DropForeignKey
ALTER TABLE "StackOnPost" DROP CONSTRAINT "StackOnPost_stackId_fkey";

-- DropTable
DROP TABLE "StackOnPost";

-- CreateTable
CREATE TABLE "_PostStacks" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_PostStacks_AB_unique" ON "_PostStacks"("A", "B");

-- CreateIndex
CREATE INDEX "_PostStacks_B_index" ON "_PostStacks"("B");

-- AddForeignKey
ALTER TABLE "_PostStacks" ADD CONSTRAINT "_PostStacks_A_fkey" FOREIGN KEY ("A") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PostStacks" ADD CONSTRAINT "_PostStacks_B_fkey" FOREIGN KEY ("B") REFERENCES "Stack"("id") ON DELETE CASCADE ON UPDATE CASCADE;
