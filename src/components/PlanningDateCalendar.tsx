"use client"

import { useMemo, useState } from "react"
import { useLocale, useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type PlanningDateCalendarProps = {
  selectedDates: string[]
  onToggleDate: (dateKey: string) => void
  disabled?: boolean
  disabledDates?: string[]
}

function buildDateKey(year: number, month: number, day: number) {
  return new Date(Date.UTC(year, month, day)).toISOString().slice(0, 10)
}

const PlanningDateCalendar = ({
  selectedDates,
  onToggleDate,
  disabled = false,
  disabledDates = [],
}: PlanningDateCalendarProps) => {
  const t = useTranslations("DatePlanner.create")
  const locale = useLocale()

  const [monthCursor, setMonthCursor] = useState(() => {
    const now = new Date()
    return { year: now.getUTCFullYear(), month: now.getUTCMonth() }
  })

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

  const disabledDateSet = useMemo(() => new Set(disabledDates), [disabledDates])

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

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{t("datePickerLabel")}</h2>
        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" onClick={() => navigateMonth("previous")} disabled={disabled}>
            {t("previousMonth")}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigateMonth("next")} disabled={disabled}>
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
            const isDisabled = disabled || disabledDateSet.has(cell.dateKey)

            return (
              <Button
                key={cell.dateKey}
                type="button"
                variant={isSelected ? "default" : "outline"}
                onClick={() => onToggleDate(cell.dateKey)}
                disabled={isDisabled}
                className={cn("h-10 w-full", isSelected && "font-semibold")}
              >
                {cell.day}
              </Button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default PlanningDateCalendar
