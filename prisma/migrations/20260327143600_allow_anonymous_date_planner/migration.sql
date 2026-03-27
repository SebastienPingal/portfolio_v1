-- Alter PlanningEvent creator relation to optional
ALTER TABLE "PlanningEvent" ALTER COLUMN "createdById" DROP NOT NULL;

ALTER TABLE "PlanningEvent" DROP CONSTRAINT "PlanningEvent_createdById_fkey";
ALTER TABLE "PlanningEvent"
ADD CONSTRAINT "PlanningEvent_createdById_fkey"
FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Add anonymous participant columns
ALTER TABLE "PlanningAvailability" ADD COLUMN "participantName" TEXT;
ALTER TABLE "PlanningAvailability" ADD COLUMN "participantKey" TEXT;

-- Backfill existing records from linked users
UPDATE "PlanningAvailability" AS pa
SET
  "participantName" = COALESCE(u."name", u."email", 'User'),
  "participantKey" = CONCAT('user:', pa."userId")
FROM "User" AS u
WHERE pa."userId" = u."id";

-- Fallback for any legacy row without a linked user
UPDATE "PlanningAvailability"
SET "participantName" = COALESCE("participantName", 'Anonymous'),
    "participantKey" = COALESCE("participantKey", CONCAT('legacy:', "id"));

ALTER TABLE "PlanningAvailability" ALTER COLUMN "participantName" SET NOT NULL;
ALTER TABLE "PlanningAvailability" ALTER COLUMN "participantKey" SET NOT NULL;

-- Make userId optional for anonymous voting
ALTER TABLE "PlanningAvailability" ALTER COLUMN "userId" DROP NOT NULL;

ALTER TABLE "PlanningAvailability" DROP CONSTRAINT "PlanningAvailability_userId_fkey";
ALTER TABLE "PlanningAvailability"
ADD CONSTRAINT "PlanningAvailability_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Replace old uniqueness constraint with participant identity uniqueness
DROP INDEX "PlanningAvailability_eventId_dateOptionId_userId_key";
CREATE UNIQUE INDEX "PlanningAvailability_eventId_dateOptionId_participantKey_key"
ON "PlanningAvailability"("eventId", "dateOptionId", "participantKey");
