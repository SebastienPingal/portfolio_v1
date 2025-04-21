-- CreateEnum
CREATE TYPE "ExternalLinkType" AS ENUM ('PERSONAL', 'PROFESSIONAL', 'DEMO');

-- AlterTable
ALTER TABLE "ExternalLink" ADD COLUMN     "type" "ExternalLinkType" NOT NULL DEFAULT 'PROFESSIONAL';
