"use client"

import { useMemo, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { useLocale, useTranslations } from "next-intl"

import { addPlanningDates } from "@/app/actions/planning"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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

  const [pendingDate, setPendingDate] = useState("")
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

  const stageDate = () => {
    const trimmed = pendingDate.trim()
    if (!trimmed) return

    if (existingDateKeys.includes(trimmed) || stagedDates.includes(trimmed)) {
      toast({ title: t("alreadyAdded"), variant: "destructive" })
      return
    }

    setStagedDates((previous) => sortDateKeys([...previous, trimmed]))
    setPendingDate("")
  }

  const removeStaged = (dateKey: string) => {
    setStagedDates((previous) => previous.filter((existing) => existing !== dateKey))
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

  return (
    <div className="glassPanel flex flex-col gap-3">
      <h2 className="text-xl font-semibold">{t("title")}</h2>
      <p className="text-sm text-muted-foreground">{t("description")}</p>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          type="date"
          value={pendingDate}
          onChange={(event) => setPendingDate(event.target.value)}
          disabled={isPending}
        />
        <Button type="button" variant="outline" onClick={stageDate} disabled={isPending || !pendingDate}>
          {t("stage")}
        </Button>
      </div>

      {stagedDates.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {stagedDates.map((dateKey) => (
            <Button
              key={dateKey}
              type="button"
              variant="outline"
              onClick={() => removeStaged(dateKey)}
              disabled={isPending}
            >
              {dateFormatter.format(new Date(`${dateKey}T00:00:00.000Z`))}
            </Button>
          ))}
        </div>
      )}

      <Button type="button" onClick={submit} disabled={isPending || stagedDates.length === 0}>
        {isPending ? t("adding") : t("submit")}
      </Button>
    </div>
  )
}

export default PlanningAddDates
