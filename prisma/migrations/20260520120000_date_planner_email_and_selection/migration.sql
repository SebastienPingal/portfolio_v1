-- Add optional email to anonymous participants
ALTER TABLE "PlanningAvailability" ADD COLUMN "participantEmail" TEXT;

-- Add selected date on events
ALTER TABLE "PlanningEvent" ADD COLUMN "selectedDateOptionId" TEXT;

CREATE UNIQUE INDEX "PlanningEvent_selectedDateOptionId_key"
ON "PlanningEvent"("selectedDateOptionId");

ALTER TABLE "PlanningEvent"
ADD CONSTRAINT "PlanningEvent_selectedDateOptionId_fkey"
FOREIGN KEY ("selectedDateOptionId") REFERENCES "PlanningDateOption"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

-- Reusable contact directory
CREATE TABLE "PlanningContact" (
  "id" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "PlanningContact_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "PlanningContact_email_key" ON "PlanningContact"("email");
