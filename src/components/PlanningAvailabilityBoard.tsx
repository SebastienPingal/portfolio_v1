"use client"

import { useEffect, useMemo, useState } from "react"
import { useLocale, useTranslations } from "next-intl"

import { toggleAvailability } from "@/app/actions/planning"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"

type AvailabilityUser = {
  id: string
  name: string | null
  email: string | null
}

type AvailabilityEntry = {
  id: string
  user: AvailabilityUser | null
  participantName: string
}

type DateOption = {
  id: string
  dateISO: string
  availabilities: AvailabilityEntry[]
}

type PlanningAvailabilityBoardProps = {
  eventId: string
  dateOptions: DateOption[]
  currentUserId?: string
  currentUserName?: string | null
}

const PlanningAvailabilityBoard = ({
  eventId,
  dateOptions,
  currentUserId,
  currentUserName,
}: PlanningAvailabilityBoardProps) => {
  const t = useTranslations("DatePlanner.event")
  const locale = useLocale()
  const { toast } = useToast()
  const [participantName, setParticipantName] = useState(currentUserName ?? "")
  const [isLoadedFromStorage, setIsLoadedFromStorage] = useState(false)
  const [optimisticDateOptions, setOptimisticDateOptions] = useState<DateOption[]>(dateOptions)
  const [pendingDateOptionIds, setPendingDateOptionIds] = useState<string[]>([])

  const dateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    [locale]
  )

  useEffect(() => {
    setOptimisticDateOptions(dateOptions)
  }, [dateOptions])

  useEffect(() => {
    if (currentUserId) {
      setParticipantName(currentUserName || "")
      setIsLoadedFromStorage(true)
      return
    }

    const cachedName = window.localStorage.getItem("date-planner-participant-name")
    if (cachedName) {
      setParticipantName(cachedName)
    }
    setIsLoadedFromStorage(true)
  }, [currentUserId, currentUserName])

  const canVote = !!currentUserId || participantName.trim().length > 0

  const isAvailabilityOwnedByCurrentParticipant = (
    availability: AvailabilityEntry,
    trimmedParticipantName: string
  ) => {
    if (currentUserId) {
      return availability.user?.id === currentUserId
    }

    return !!trimmedParticipantName && availability.participantName === trimmedParticipantName
  }

  const createCurrentParticipantEntry = (dateOptionId: string, trimmedParticipantName: string): AvailabilityEntry => ({
    id: `optimistic-${dateOptionId}-${Date.now()}`,
    participantName: currentUserId
      ? currentUserName?.trim() || "User"
      : trimmedParticipantName,
    user: currentUserId
      ? {
          id: currentUserId,
          name: currentUserName ?? null,
          email: null,
        }
      : null,
  })

  const onToggle = (dateOptionId: string) => {
    if (!canVote) {
      toast({
        title: t("participantNameRequired"),
        variant: "destructive",
      })
      return
    }

    if (pendingDateOptionIds.includes(dateOptionId)) {
      return
    }

    const trimmedName = participantName.trim()
    if (!currentUserId && trimmedName) {
      window.localStorage.setItem("date-planner-participant-name", trimmedName)
    }

    let wasSelected = false

    setOptimisticDateOptions((previousOptions) =>
      previousOptions.map((option) => {
        if (option.id !== dateOptionId) {
          return option
        }

        wasSelected = option.availabilities.some((availability) =>
          isAvailabilityOwnedByCurrentParticipant(availability, trimmedName)
        )

        if (wasSelected) {
          return {
            ...option,
            availabilities: option.availabilities.filter(
              (availability) => !isAvailabilityOwnedByCurrentParticipant(availability, trimmedName)
            ),
          }
        }

        return {
          ...option,
          availabilities: [...option.availabilities, createCurrentParticipantEntry(dateOptionId, trimmedName)],
        }
      })
    )

    setPendingDateOptionIds((previous) => [...previous, dateOptionId])

    void toggleAvailability({
      eventId,
      dateOptionId,
      participantName: currentUserId ? undefined : trimmedName,
    })
      .catch((error) => {
        // Roll back only the date that failed.
        setOptimisticDateOptions((previousOptions) =>
          previousOptions.map((option) => {
            if (option.id !== dateOptionId) {
              return option
            }

            if (wasSelected) {
              return {
                ...option,
                availabilities: [...option.availabilities, createCurrentParticipantEntry(dateOptionId, trimmedName)],
              }
            }

            return {
              ...option,
              availabilities: option.availabilities.filter(
                (availability) => !isAvailabilityOwnedByCurrentParticipant(availability, trimmedName)
              ),
            }
          })
        )

        toast({
          title: t("toggleFailed"),
          description: error instanceof Error ? error.message : undefined,
          variant: "destructive",
        })
      })
      .finally(() => {
        setPendingDateOptionIds((previous) => previous.filter((id) => id !== dateOptionId))
      })
  }

  return (
    <div className="flex flex-col gap-6">
      {!currentUserId && isLoadedFromStorage && (
        <div className="glassPanel flex flex-col gap-2">
          <label htmlFor="participant-name" className="text-sm font-medium">
            {t("participantNameLabel")}
          </label>
          <Input
            id="participant-name"
            value={participantName}
            onChange={(event) => setParticipantName(event.target.value)}
            placeholder={t("participantNamePlaceholder")}
          />
          {!canVote && (
            <p className="text-sm text-muted-foreground">{t("participantNameGateHint")}</p>
          )}
        </div>
      )}

      <div
        className={cn(
          "flex flex-col gap-6 lg:grid lg:grid-cols-[2fr_1fr] lg:items-start",
          !canVote && "pointer-events-none select-none opacity-50"
        )}
      >
        <section className="flex flex-col gap-4">
        {optimisticDateOptions.map((dateOption) => {
          const trimmedParticipantName = participantName.trim()
          const isSelectedByCurrentUser =
            dateOption.availabilities.some((availability) => {
              return isAvailabilityOwnedByCurrentParticipant(availability, trimmedParticipantName)
            })

          return (
            <article key={dateOption.id} className="glassPanel flex flex-col gap-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-xl font-semibold">
                  {dateFormatter.format(new Date(dateOption.dateISO))}
                </h2>
                <Button
                  type="button"
                  variant={isSelectedByCurrentUser ? "default" : "outline"}
                  onClick={() => onToggle(dateOption.id)}
                  disabled={!canVote || pendingDateOptionIds.includes(dateOption.id)}
                >
                  {isSelectedByCurrentUser ? t("unselectButton") : t("selectButton")}
                </Button>
              </div>

              <div className="flex flex-col gap-2">
                <p className="font-medium">
                  {t("availableCount", { count: dateOption.availabilities.length })}
                </p>
                <div className="flex flex-wrap gap-2">
                  {dateOption.availabilities.length === 0 ? (
                    <p className="text-muted-foreground">{t("noParticipants")}</p>
                  ) : (
                    dateOption.availabilities.map((availability) => (
                      <span
                        key={availability.id}
                        className={cn(
                          "rounded-full border border-border/60 bg-card/80 px-3 py-1 text-sm",
                          currentUserId
                            ? availability.user?.id === currentUserId && "border-primary/50"
                            : availability.participantName === trimmedParticipantName && "border-primary/50"
                        )}
                      >
                        {availability.participantName}
                      </span>
                    ))
                  )}
                </div>
              </div>
            </article>
          )
        })}
        </section>

        <aside className="glassPanel sticky top-4 flex flex-col gap-4">
          <h2 className="text-xl font-semibold">{t("summaryTitle")}</h2>
          <div className="flex flex-col gap-3">
            {optimisticDateOptions.map((dateOption) => (
              <div key={dateOption.id} className="flex flex-col gap-1 rounded-lg border border-border/50 bg-card/60 p-3">
                <p className="font-medium">{dateFormatter.format(new Date(dateOption.dateISO))}</p>
                <p className="text-sm text-muted-foreground">
                  {t("availableCount", { count: dateOption.availabilities.length })}
                </p>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  )
}

export default PlanningAvailabilityBoard
