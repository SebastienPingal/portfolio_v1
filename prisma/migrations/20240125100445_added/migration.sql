/*
  Warnings:

  - You are about to drop the column `firstName` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "firstName",
ADD COLUMN     "firstname" TEXT;
