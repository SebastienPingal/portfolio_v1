/*
  Warnings:

  - You are about to drop the column `logoBlack` on the `ExternalLink` table. All the data in the column will be lost.
  - You are about to drop the column `logoWhite` on the `ExternalLink` table. All the data in the column will be lost.
  - Added the required column `logo` to the `ExternalLink` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ExternalLink" DROP COLUMN "logoBlack",
DROP COLUMN "logoWhite",
ADD COLUMN     "logo" TEXT NOT NULL;
