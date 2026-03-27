"use client"

import { FormEvent, useMemo, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { useLocale, useTranslations } from "next-intl"

import { createPlanningEvent } from "@/app/actions/planning"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"

function sortDateKeys(dateKeys: string[]) {
  return [...dateKeys].sort((left, right) => left.localeCompare(right))
}

function buildDateKey(year: number, month: number, day: number) {
  return new Date(Date.UTC(year, month, day)).toISOString().slice(0, 10)
}

const PlanningCreateForm = () => {
  const t = useTranslations("DatePlanner.create")
  const locale = useLocale()
  const router = useRouter()
  const { toast } = useToast()

  const [eventTitle, setEventTitle] = useState("")
  const [selectedDates, setSelectedDates] = useState<string[]>([])
  const [isPending, startTransition] = useTransition()
  const [monthCursor, setMonthCursor] = useState(() => {
    const now = new Date()
    return { year: now.getUTCFullYear(), month: now.getUTCMonth() }
  })

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

  const weekDayFormatter = useMemo(
    () => new Intl.DateTimeFormat(locale, { weekday: "short" }),
    [locale]
  )

  const monthFormatter = useMemo(
    () => new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }),
    [locale]
  )

  const weekDayLabels = useMemo(() => {
    return Array.from({ length: 7 }, (_, index) => {
      const referenceDate = new Date(Date.UTC(2024, 0, 1 + index))
      return weekDayFormatter.format(referenceDate)
    })
  }, [weekDayFormatter])

  const monthLabel = monthFormatter.format(
    new Date(Date.UTC(monthCursor.year, monthCursor.month, 1))
  )

  const daysInMonth = new Date(Date.UTC(monthCursor.year, monthCursor.month + 1, 0)).getUTCDate()
  const firstDayOfMonth = new Date(Date.UTC(monthCursor.year, monthCursor.month, 1)).getUTCDay()
  const leadingEmptyCells = (firstDayOfMonth + 6) % 7
  const totalCells = Math.ceil((leadingEmptyCells + daysInMonth) / 7) * 7

  const calendarCells = Array.from({ length: totalCells }, (_, cellIndex) => {
    const day = cellIndex - leadingEmptyCells + 1
    if (day < 1 || day > daysInMonth) {
      return null
    }

    const dateKey = buildDateKey(monthCursor.year, monthCursor.month, day)
    return { day, dateKey }
  })

  const navigateMonth = (direction: "previous" | "next") => {
    setMonthCursor((previous) => {
      const monthOffset = direction === "next" ? 1 : -1
      const nextDate = new Date(Date.UTC(previous.year, previous.month + monthOffset, 1))
      return { year: nextDate.getUTCFullYear(), month: nextDate.getUTCMonth() }
    })
  }

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

        router.push(`/date-planner/${result.slug}`)
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

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">{t("datePickerLabel")}</h2>
          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" onClick={() => navigateMonth("previous")} disabled={isPending}>
              {t("previousMonth")}
            </Button>
            <Button type="button" variant="outline" onClick={() => navigateMonth("next")} disabled={isPending}>
              {t("nextMonth")}
            </Button>
          </div>
        </div>

        <div className="glassPanel flex flex-col gap-3">
          <p className="text-lg font-semibold capitalize">{monthLabel}</p>

          <div className="grid grid-cols-7 gap-2">
            {weekDayLabels.map((weekDayLabel) => (
              <div
                key={weekDayLabel}
                className="flex h-8 items-center justify-center text-xs font-semibold text-muted-foreground"
              >
                {weekDayLabel}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {calendarCells.map((cell, index) => {
              if (!cell) {
                return <div key={`empty-${index}`} className="h-10 w-full" />
              }

              const isSelected = selectedDates.includes(cell.dateKey)

              return (
                <Button
                  key={cell.dateKey}
                  type="button"
                  variant={isSelected ? "default" : "outline"}
                  onClick={() => toggleDate(cell.dateKey)}
                  disabled={isPending}
                  className={cn("h-10 w-full", isSelected && "font-semibold")}
                >
                  {cell.day}
                </Button>
              )
            })}
          </div>
        </div>
      </div>

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
