import { notFound } from "next/navigation"
import { getTranslations } from "next-intl/server"

import { auth } from "@/app/api/auth/[...nextauth]/auth"
import { getPlanningEventById } from "@/app/actions/planning"
import PlanningAvailabilityBoard from "@/components/PlanningAvailabilityBoard"

interface DatePlannerEventPageProps {
  params: Promise<{
    id: string
  }>
}

const DatePlannerEventPage = async ({ params }: DatePlannerEventPageProps) => {
  const [{ id }, session, t] = await Promise.all([
    params,
    auth(),
    getTranslations("DatePlanner"),
  ])

  const event = await getPlanningEventById(id)
  if (!event) {
    notFound()
  }

  const dateOptions = event.dateOptions.map((dateOption) => ({
    id: dateOption.id,
    dateISO: dateOption.date.toISOString(),
    availabilities: dateOption.availabilities.map((availability) => ({
      id: availability.id,
      participantName:
        availability.user?.name || availability.user?.email || availability.participantName,
      user: availability.user
        ? {
            id: availability.user.id,
            name: availability.user.name,
            email: availability.user.email,
          }
        : null,
    })),
  }))

  return (
    <div className="flex flex-col gap-6">
      <header className="glassPanel flex flex-col gap-2">
        <h1 className="text-3xl font-bold">{event.title}</h1>
        <p className="text-muted-foreground">{t("event.subtitle")}</p>
      </header>

      <PlanningAvailabilityBoard
        eventId={event.id}
        dateOptions={dateOptions}
        currentUserId={session?.user?.id}
        currentUserName={session?.user?.name}
      />
    </div>
  )
}

export default DatePlannerEventPage
