/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `Stack` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Stack_title_key" ON "Stack"("title");
