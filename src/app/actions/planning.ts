'use server'

import { randomUUID } from 'crypto'
import { auth } from '@/app/api/auth/[...nextauth]/auth'
import prisma from '@/lib/db'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

type CreatePlanningEventInput = {
  title: string
  dates: string[]
}

type ToggleAvailabilityInput = {
  eventId: string
  dateOptionId: string
  participantName?: string
}

type AddPlanningDatesInput = {
  eventId: string
  dates: string[]
}

function toDateKey(date: Date) {
  return date.toISOString().slice(0, 10)
}

function normalizeDate(input: string) {
  return new Date(`${input}T00:00:00.000Z`)
}

async function getAnonymousCreatorId() {
  const anonymousCreator = await prisma.user.upsert({
    where: {
      email: 'date-planner-anonymous@local.invalid',
    },
    update: {},
    create: {
      email: 'date-planner-anonymous@local.invalid',
      name: 'Date Planner Anonymous',
    },
    select: {
      id: true,
    },
  })

  return anonymousCreator.id
}

async function generateEventSlug(title: string) {
  const baseSlug = title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'event'

  let slug = baseSlug
  let counter = 1

  while (await prisma.planningEvent.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter}`
    counter += 1
  }

  return slug
}

export async function createPlanningEvent({ title, dates }: CreatePlanningEventInput) {
  const session = await auth()
  const userId = session?.user?.id
  const creatorId = userId ?? await getAnonymousCreatorId()

  const normalizedTitle = title.trim()
  if (!normalizedTitle) {
    throw new Error('Event title is required')
  }

  const normalizedDates = Array.from(
    new Set(
      dates
        .map((dateString) => dateString.trim())
        .filter(Boolean)
    )
  ).sort()

  if (normalizedDates.length === 0) {
    throw new Error('At least one date is required')
  }

  const slug = await generateEventSlug(normalizedTitle)

  const createdEvent = await prisma.planningEvent.create({
    data: {
      title: normalizedTitle,
      slug,
      createdBy: {
        connect: {
          id: creatorId,
        },
      },
      dateOptions: {
        create: normalizedDates.map((dateString) => ({
          date: normalizeDate(dateString),
        })),
      },
    },
    select: {
      id: true,
    },
  })

  revalidatePath('/date-planner')

  return createdEvent
}

export async function getPlanningEventById(id: string) {
  if (!id?.trim()) {
    return null
  }

  const event = await prisma.planningEvent.findUnique({
    where: { id },
    include: {
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      dateOptions: {
        orderBy: {
          date: 'asc',
        },
        include: {
          availabilities: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
            orderBy: {
              createdAt: 'asc',
            },
          },
        },
      },
    },
  })

  if (!event) {
    return null
  }

  return {
    ...event,
    dateOptions: event.dateOptions.map((option) => ({
      ...option,
      dateKey: toDateKey(option.date),
    })),
  }
}

export async function addPlanningDates({ eventId, dates }: AddPlanningDatesInput) {
  if (!eventId?.trim()) {
    throw new Error('Event id is required')
  }

  const event = await prisma.planningEvent.findUnique({
    where: { id: eventId },
    include: {
      dateOptions: {
        select: { date: true },
      },
    },
  })

  if (!event) {
    throw new Error('Event not found')
  }

  const existingDateKeys = new Set(event.dateOptions.map((option) => toDateKey(option.date)))

  const normalizedDates = Array.from(
    new Set(
      dates
        .map((dateString) => dateString.trim())
        .filter(Boolean)
    )
  )
    .filter((dateString) => !existingDateKeys.has(dateString))
    .sort()

  if (normalizedDates.length === 0) {
    throw new Error('No new date to add')
  }

  await prisma.planningDateOption.createMany({
    data: normalizedDates.map((dateString) => ({
      eventId,
      date: normalizeDate(dateString),
    })),
  })

  revalidatePath(`/date-planner/${eventId}`)

  return { added: normalizedDates.length }
}

export async function toggleAvailability({ eventId, dateOptionId, participantName }: ToggleAvailabilityInput) {
  const session = await auth()
  const userId = session?.user?.id
  const cookieStore = await cookies()

  let participantKey = ''
  let effectiveParticipantName = ''

  if (userId) {
    participantKey = `user:${userId}`
    effectiveParticipantName = session.user?.name || session.user?.email || 'User'
  } else {
    const trimmedName = participantName?.trim()
    if (!trimmedName) {
      throw new Error('Participant name is required for anonymous voting')
    }

    let anonymousId = cookieStore.get('date_planner_participant_id')?.value
    if (!anonymousId) {
      anonymousId = randomUUID()
      cookieStore.set('date_planner_participant_id', anonymousId, {
        path: '/',
        maxAge: 60 * 60 * 24 * 365,
      })
    }

    participantKey = `anon:${anonymousId}`
    effectiveParticipantName = trimmedName
  }

  const option = await prisma.planningDateOption.findFirst({
    where: {
      id: dateOptionId,
      eventId,
    },
    include: {
      event: {
        select: {
          id: true,
        },
      },
    },
  })

  if (!option) {
    throw new Error('Date option not found')
  }

  const existingAvailability = await prisma.planningAvailability.findFirst({
    where: {
      eventId,
      dateOptionId,
      participantKey,
    },
  })

  if (existingAvailability) {
    await prisma.planningAvailability.delete({
      where: {
        id: existingAvailability.id,
      },
    })
  } else {
    await prisma.planningAvailability.create({
      data: {
        eventId,
        dateOptionId,
        userId: userId ?? null,
        participantName: effectiveParticipantName,
        participantKey,
      },
    })
  }

  revalidatePath(`/date-planner/${option.event.id}`)

  return { selected: !existingAvailability }
}
