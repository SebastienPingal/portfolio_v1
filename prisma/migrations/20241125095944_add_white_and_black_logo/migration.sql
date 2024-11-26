/*
  Warnings:

  - You are about to drop the column `logo` on the `ExternalLink` table. All the data in the column will be lost.
  - Added the required column `logoBlack` to the `ExternalLink` table without a default value. This is not possible if the table is not empty.
  - Added the required column `logoWhite` to the `ExternalLink` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ExternalLink" DROP COLUMN "logo",
ADD COLUMN     "logoBlack" TEXT NOT NULL,
ADD COLUMN     "logoWhite" TEXT NOT NULL;
