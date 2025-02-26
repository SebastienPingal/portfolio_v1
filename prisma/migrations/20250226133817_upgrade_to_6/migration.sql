-- AlterTable
ALTER TABLE "_PostStacks" ADD CONSTRAINT "_PostStacks_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_PostStacks_AB_unique";

-- AlterTable
ALTER TABLE "_UserStacks" ADD CONSTRAINT "_UserStacks_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_UserStacks_AB_unique";
