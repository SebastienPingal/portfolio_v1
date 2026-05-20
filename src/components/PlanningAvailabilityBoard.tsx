"use client"

import { useEffect, useMemo, useState, useTransition } from "react"
import { useLocale, useTranslations } from "next-intl"

import { selectFinalDate, toggleAvailability } from "@/app/actions/planning"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
  selectedDateOptionId?: string | null
  currentUserId?: string
  currentUserName?: string | null
  currentUserEmail?: string | null
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const PlanningAvailabilityBoard = ({
  eventId,
  dateOptions,
  selectedDateOptionId,
  currentUserId,
  currentUserName,
  currentUserEmail,
}: PlanningAvailabilityBoardProps) => {
  const t = useTranslations("DatePlanner.event")
  const locale = useLocale()
  const { toast } = useToast()
  const [participantName, setParticipantName] = useState(currentUserName ?? "")
  const [participantEmail, setParticipantEmail] = useState(currentUserEmail ?? "")
  const [isLoadedFromStorage, setIsLoadedFromStorage] = useState(false)
  const [optimisticDateOptions, setOptimisticDateOptions] = useState<DateOption[]>(dateOptions)
  const [pendingDateOptionIds, setPendingDateOptionIds] = useState<string[]>([])
  const [optimisticSelectedDateOptionId, setOptimisticSelectedDateOptionId] = useState<string | null>(
    selectedDateOptionId ?? null
  )
  const [isSelectingFinalDate, startSelectFinalDateTransition] = useTransition()
  const [pendingFinalDateOptionId, setPendingFinalDateOptionId] = useState<string | null>(null)

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
    setOptimisticSelectedDateOptionId(selectedDateOptionId ?? null)
  }, [selectedDateOptionId])

  useEffect(() => {
    if (currentUserId) {
      setParticipantName(currentUserName || "")
      setParticipantEmail(currentUserEmail || "")
      setIsLoadedFromStorage(true)
      return
    }

    const cachedName = window.localStorage.getItem("date-planner-participant-name")
    if (cachedName) {
      setParticipantName(cachedName)
    }
    const cachedEmail = window.localStorage.getItem("date-planner-participant-email")
    if (cachedEmail) {
      setParticipantEmail(cachedEmail)
    }
    setIsLoadedFromStorage(true)
  }, [currentUserId, currentUserName, currentUserEmail])

  const trimmedEmail = participantEmail.trim()
  const hasInvalidEmail = trimmedEmail.length > 0 && !EMAIL_REGEX.test(trimmedEmail)
  const canVote =
    (!!currentUserId || participantName.trim().length > 0) && !hasInvalidEmail

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
          email: currentUserEmail ?? null,
        }
      : null,
  })

  const onToggle = (dateOptionId: string) => {
    if (!canVote) {
      toast({
        title: hasInvalidEmail ? t("invalidEmail") : t("participantNameRequired"),
        variant: "destructive",
      })
      return
    }

    if (pendingDateOptionIds.includes(dateOptionId)) {
      return
    }

    const trimmedName = participantName.trim()
    if (!currentUserId) {
      if (trimmedName) {
        window.localStorage.setItem("date-planner-participant-name", trimmedName)
      }
      if (trimmedEmail) {
        window.localStorage.setItem("date-planner-participant-email", trimmedEmail)
      }
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
      participantEmail: currentUserId ? undefined : trimmedEmail || undefined,
    })
      .catch((error) => {
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

  const confirmSelectFinalDate = () => {
    const dateOptionId = pendingFinalDateOptionId
    if (!dateOptionId || isSelectingFinalDate) return
    const previousSelected = optimisticSelectedDateOptionId
    setOptimisticSelectedDateOptionId(dateOptionId)

    startSelectFinalDateTransition(async () => {
      try {
        const result = await selectFinalDate({ eventId, dateOptionId })
        toast({
          title: t("finalDateSelected"),
          description: t("finalDateNotified", { count: result.notified }),
        })
        setPendingFinalDateOptionId(null)
      } catch (error) {
        setOptimisticSelectedDateOptionId(previousSelected)
        toast({
          title: t("finalDateFailed"),
          description: error instanceof Error ? error.message : undefined,
          variant: "destructive",
        })
      }
    })
  }

  const selectedDateOption = optimisticDateOptions.find(
    (option) => option.id === optimisticSelectedDateOptionId
  )

  const pendingFinalDateOption = optimisticDateOptions.find(
    (option) => option.id === pendingFinalDateOptionId
  )

  return (
    <div className="flex flex-col gap-6">
      {selectedDateOption && (
        <div className="glassPanel flex flex-col gap-1 border-primary/40">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            {t("finalDateBadge")}
          </p>
          <p className="text-xl font-semibold">
            {dateFormatter.format(new Date(selectedDateOption.dateISO))}
          </p>
        </div>
      )}

      {!currentUserId && isLoadedFromStorage && (
        <div className="glassPanel flex flex-col gap-3">
          <div className="flex flex-col gap-2">
            <label htmlFor="participant-name" className="text-sm font-medium">
              {t("participantNameLabel")}
            </label>
            <Input
              id="participant-name"
              value={participantName}
              onChange={(event) => setParticipantName(event.target.value)}
              placeholder={t("participantNamePlaceholder")}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="participant-email" className="text-sm font-medium">
              {t("participantEmailLabel")}
            </label>
            <Input
              id="participant-email"
              type="email"
              value={participantEmail}
              onChange={(event) => setParticipantEmail(event.target.value)}
              placeholder={t("participantEmailPlaceholder")}
            />
            <p className="text-xs text-muted-foreground">{t("participantEmailHint")}</p>
            {hasInvalidEmail && (
              <p className="text-xs text-destructive">{t("invalidEmail")}</p>
            )}
          </div>
          {!canVote && !hasInvalidEmail && (
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
          const isFinalSelected = dateOption.id === optimisticSelectedDateOptionId

          return (
            <article
              key={dateOption.id}
              className={cn(
                "glassPanel flex flex-col gap-4",
                isFinalSelected && "border-primary/60"
              )}
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-semibold">
                    {dateFormatter.format(new Date(dateOption.dateISO))}
                  </h2>
                  {isFinalSelected && (
                    <span className="rounded-full bg-primary/15 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-primary">
                      {t("finalDateBadge")}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    type="button"
                    variant={isSelectedByCurrentUser ? "default" : "outline"}
                    onClick={() => onToggle(dateOption.id)}
                    disabled={!canVote || pendingDateOptionIds.includes(dateOption.id)}
                  >
                    {isSelectedByCurrentUser ? t("unselectButton") : t("selectButton")}
                  </Button>
                  {!isFinalSelected && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-xs text-muted-foreground"
                      onClick={() => setPendingFinalDateOptionId(dateOption.id)}
                      disabled={isSelectingFinalDate}
                    >
                      {t("chooseFinalDate")}
                    </Button>
                  )}
                </div>
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
              <div
                key={dateOption.id}
                className={cn(
                  "flex flex-col gap-1 rounded-lg border border-border/50 bg-card/60 p-3",
                  dateOption.id === optimisticSelectedDateOptionId && "border-primary/60"
                )}
              >
                <p className="font-medium">{dateFormatter.format(new Date(dateOption.dateISO))}</p>
                <p className="text-sm text-muted-foreground">
                  {t("availableCount", { count: dateOption.availabilities.length })}
                </p>
              </div>
            ))}
          </div>
        </aside>
      </div>

      <Dialog
        open={!!pendingFinalDateOptionId}
        onOpenChange={(open) => {
          if (!open && !isSelectingFinalDate) {
            setPendingFinalDateOptionId(null)
          }
        }}
      >
        <DialogContent className="sm:max-w-lg rounded-lg">
          <DialogHeader>
            <DialogTitle>{t("confirmFinalDateTitle")}</DialogTitle>
            <DialogDescription>
              {pendingFinalDateOption
                ? t("confirmFinalDateDescription", {
                    date: dateFormatter.format(new Date(pendingFinalDateOption.dateISO)),
                  })
                : ""}
            </DialogDescription>
          </DialogHeader>
          <ul className="flex list-disc flex-col gap-2 pl-5 text-sm text-muted-foreground">
            <li>{t("confirmFinalDateConsequenceSave")}</li>
            <li>{t("confirmFinalDateConsequenceEmail")}</li>
            <li>{t("confirmFinalDateConsequenceCalendar")}</li>
          </ul>
          <DialogFooter className="gap-2 sm:gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setPendingFinalDateOptionId(null)}
              disabled={isSelectingFinalDate}
            >
              {t("confirmFinalDateCancel")}
            </Button>
            <Button type="button" onClick={confirmSelectFinalDate} disabled={isSelectingFinalDate}>
              {isSelectingFinalDate ? t("confirmFinalDateSending") : t("confirmFinalDateConfirm")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default PlanningAvailabilityBoard
