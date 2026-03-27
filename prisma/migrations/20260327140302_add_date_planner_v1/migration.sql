-- CreateTable
CREATE TABLE "PlanningEvent" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlanningEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlanningDateOption" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlanningDateOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlanningAvailability" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "dateOptionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlanningAvailability_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PlanningEvent_slug_key" ON "PlanningEvent"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "PlanningDateOption_eventId_date_key" ON "PlanningDateOption"("eventId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "PlanningAvailability_eventId_dateOptionId_userId_key" ON "PlanningAvailability"("eventId", "dateOptionId", "userId");

-- AddForeignKey
ALTER TABLE "PlanningEvent" ADD CONSTRAINT "PlanningEvent_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanningDateOption" ADD CONSTRAINT "PlanningDateOption_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "PlanningEvent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanningAvailability" ADD CONSTRAINT "PlanningAvailability_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "PlanningEvent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanningAvailability" ADD CONSTRAINT "PlanningAvailability_dateOptionId_fkey" FOREIGN KEY ("dateOptionId") REFERENCES "PlanningDateOption"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanningAvailability" ADD CONSTRAINT "PlanningAvailability_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
