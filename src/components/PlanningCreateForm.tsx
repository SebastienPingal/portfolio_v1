"use client"

import { FormEvent, useMemo, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { useLocale, useTranslations } from "next-intl"

import { createPlanningEvent } from "@/app/actions/planning"
import PlanningDateCalendar from "@/components/PlanningDateCalendar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"

function sortDateKeys(dateKeys: string[]) {
  return [...dateKeys].sort((left, right) => left.localeCompare(right))
}

const PlanningCreateForm = () => {
  const t = useTranslations("DatePlanner.create")
  const locale = useLocale()
  const router = useRouter()
  const { toast } = useToast()

  const [eventTitle, setEventTitle] = useState("")
  const [selectedDates, setSelectedDates] = useState<string[]>([])
  const [isPending, startTransition] = useTransition()

  const dateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
    [locale]
  )

  const toggleDate = (dateKey: string) => {
    setSelectedDates((previousDates) => {
      if (previousDates.includes(dateKey)) {
        return previousDates.filter((existingDate) => existingDate !== dateKey)
      }
      return sortDateKeys([...previousDates, dateKey])
    })
  }

  const removeDate = (dateKey: string) => {
    setSelectedDates((previousDates) => previousDates.filter((existingDate) => existingDate !== dateKey))
  }

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!eventTitle.trim()) {
      toast({
        title: t("errors.titleRequired"),
        variant: "destructive",
      })
      return
    }

    if (selectedDates.length === 0) {
      toast({
        title: t("errors.dateRequired"),
        variant: "destructive",
      })
      return
    }

    startTransition(async () => {
      try {
        const result = await createPlanningEvent({
          title: eventTitle,
          dates: selectedDates,
        })

        router.push(`/date-planner/${result.id}`)
      } catch (error) {
        toast({
          title: t("errors.createFailed"),
          description: error instanceof Error ? error.message : undefined,
          variant: "destructive",
        })
      }
    })
  }

  return (
    <form className="glassPanel flex flex-col gap-6" onSubmit={onSubmit}>
      <div className="flex flex-col gap-2">
        <label htmlFor="event-title" className="font-medium">
          {t("eventTitleLabel")}
        </label>
        <Input
          id="event-title"
          value={eventTitle}
          onChange={(event) => setEventTitle(event.target.value)}
          placeholder={t("eventTitlePlaceholder")}
          disabled={isPending}
        />
      </div>

      <PlanningDateCalendar
        selectedDates={selectedDates}
        onToggleDate={toggleDate}
        disabled={isPending}
      />

      <div className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold">{t("selectedDatesTitle")}</h2>
        {selectedDates.length === 0 ? (
          <p className="text-muted-foreground">{t("emptyDates")}</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {selectedDates.map((dateKey) => (
              <Button
                key={dateKey}
                type="button"
                variant="outline"
                onClick={() => removeDate(dateKey)}
                disabled={isPending}
              >
                {dateFormatter.format(new Date(`${dateKey}T00:00:00.000Z`))}
              </Button>
            ))}
          </div>
        )}
        {selectedDates.length > 0 && <p className="text-sm text-muted-foreground">{t("removeHint")}</p>}
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? t("creating") : t("submit")}
      </Button>
    </form>
  )
}

export default PlanningCreateForm
