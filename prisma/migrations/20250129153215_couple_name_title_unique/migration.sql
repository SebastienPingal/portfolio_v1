/*
  Warnings:

  - A unique constraint covering the columns `[title,userId]` on the table `CV` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "CV_title_key";

-- CreateIndex
CREATE UNIQUE INDEX "CV_title_userId_key" ON "CV"("title", "userId");
