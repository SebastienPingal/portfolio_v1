"use client"

import { useMemo, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { useLocale, useTranslations } from "next-intl"

import { addPlanningDates } from "@/app/actions/planning"
import PlanningDateCalendar from "@/components/PlanningDateCalendar"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

type PlanningAddDatesProps = {
  eventId: string
  existingDateKeys: string[]
}

function sortDateKeys(dateKeys: string[]) {
  return [...dateKeys].sort((left, right) => left.localeCompare(right))
}

const PlanningAddDates = ({ eventId, existingDateKeys }: PlanningAddDatesProps) => {
  const t = useTranslations("DatePlanner.event.addDates")
  const locale = useLocale()
  const router = useRouter()
  const { toast } = useToast()

  const [isOpen, setIsOpen] = useState(false)
  const [stagedDates, setStagedDates] = useState<string[]>([])
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
    if (existingDateKeys.includes(dateKey)) return

    setStagedDates((previous) => {
      if (previous.includes(dateKey)) {
        return previous.filter((existing) => existing !== dateKey)
      }
      return sortDateKeys([...previous, dateKey])
    })
  }

  const cancel = () => {
    setStagedDates([])
    setIsOpen(false)
  }

  const submit = () => {
    if (stagedDates.length === 0) {
      toast({ title: t("errors.dateRequired"), variant: "destructive" })
      return
    }

    startTransition(async () => {
      try {
        await addPlanningDates({ eventId, dates: stagedDates })
        setStagedDates([])
        setIsOpen(false)
        router.refresh()
      } catch (error) {
        toast({
          title: t("errors.addFailed"),
          description: error instanceof Error ? error.message : undefined,
          variant: "destructive",
        })
      }
    })
  }

  if (!isOpen) {
    return (
      <div className="flex">
        <Button type="button" variant="outline" onClick={() => setIsOpen(true)}>
          {t("openButton")}
        </Button>
      </div>
    )
  }

  return (
    <div className="glassPanel flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-semibold">{t("title")}</h2>
        <p className="text-sm text-muted-foreground">{t("description")}</p>
      </div>

      <PlanningDateCalendar
        selectedDates={stagedDates}
        onToggleDate={toggleDate}
        disabled={isPending}
        disabledDates={existingDateKeys}
      />

      <div className="flex flex-col gap-2">
        <h3 className="font-semibold">{t("selectedTitle")}</h3>
        {stagedDates.length === 0 ? (
          <p className="text-muted-foreground">{t("empty")}</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {stagedDates.map((dateKey) => (
              <Button
                key={dateKey}
                type="button"
                variant="outline"
                onClick={() => toggleDate(dateKey)}
                disabled={isPending}
              >
                {dateFormatter.format(new Date(`${dateKey}T00:00:00.000Z`))}
              </Button>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <Button type="button" onClick={submit} disabled={isPending || stagedDates.length === 0}>
          {isPending ? t("adding") : t("submit")}
        </Button>
        <Button type="button" variant="outline" onClick={cancel} disabled={isPending}>
          {t("cancel")}
        </Button>
      </div>
    </div>
  )
}

export default PlanningAddDates
