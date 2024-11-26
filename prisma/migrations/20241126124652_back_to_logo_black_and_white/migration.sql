/*
  Warnings:

  - You are about to drop the column `logo` on the `ExternalLink` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ExternalLink" DROP COLUMN "logo",
ADD COLUMN     "logoBlack" TEXT,
ADD COLUMN     "logoWhite" TEXT;
