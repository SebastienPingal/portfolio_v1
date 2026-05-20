import { Resend } from 'resend'

type Recipient = {
  email: string
  name: string
}

type SendSelectedDateInput = {
  eventTitle: string
  eventId: string
  selectedDate: Date
  recipients: Recipient[]
  organizer?: Recipient
}

function pad(value: number) {
  return value.toString().padStart(2, '0')
}

function toICSDate(date: Date) {
  return (
    `${date.getUTCFullYear()}` +
    `${pad(date.getUTCMonth() + 1)}` +
    `${pad(date.getUTCDate())}`
  )
}

function nowICSStamp() {
  const now = new Date()
  return (
    `${now.getUTCFullYear()}${pad(now.getUTCMonth() + 1)}${pad(now.getUTCDate())}` +
    `T${pad(now.getUTCHours())}${pad(now.getUTCMinutes())}${pad(now.getUTCSeconds())}Z`
  )
}

function escapeICS(value: string) {
  return value.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n')
}

function buildICS({
  eventTitle,
  eventId,
  selectedDate,
  organizer,
  attendees,
}: {
  eventTitle: string
  eventId: string
  selectedDate: Date
  organizer: Recipient
  attendees: Recipient[]
}) {
  const start = toICSDate(selectedDate)
  const next = new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000)
  const end = toICSDate(next)

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Portfolio//Date Planner//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:REQUEST',
    'BEGIN:VEVENT',
    `UID:date-planner-${eventId}@portfolio`,
    `DTSTAMP:${nowICSStamp()}`,
    `DTSTART;VALUE=DATE:${start}`,
    `DTEND;VALUE=DATE:${end}`,
    'SEQUENCE:0',
    'STATUS:CONFIRMED',
    'TRANSP:OPAQUE',
    `SUMMARY:${escapeICS(eventTitle)}`,
    `DESCRIPTION:${escapeICS(`Date confirmée pour ${eventTitle}.`)}`,
    `ORGANIZER;CN=${escapeICS(organizer.name)}:mailto:${organizer.email}`,
  ]

  for (const attendee of attendees) {
    lines.push(
      `ATTENDEE;CN=${escapeICS(attendee.name)};RSVP=TRUE;ROLE=REQ-PARTICIPANT;PARTSTAT=NEEDS-ACTION:mailto:${attendee.email}`
    )
  }

  lines.push('END:VEVENT', 'END:VCALENDAR')
  return lines.join('\r\n')
}

function buildGoogleCalendarLink({ eventTitle, selectedDate }: { eventTitle: string; selectedDate: Date }) {
  const start = toICSDate(selectedDate)
  const next = new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000)
  const end = toICSDate(next)
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: eventTitle,
    dates: `${start}/${end}`,
  })
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

export async function sendPlanningSelectedDateEmail({
  eventTitle,
  eventId,
  selectedDate,
  recipients,
  organizer,
}: SendSelectedDateInput) {
  if (!process.env.RESEND_API_KEY || recipients.length === 0) return

  const resend = new Resend(process.env.RESEND_API_KEY)
  const effectiveOrganizer: Recipient = organizer ?? {
    email: 'onboarding@resend.dev',
    name: 'Date Planner',
  }

  const ics = buildICS({
    eventTitle,
    eventId,
    selectedDate,
    organizer: effectiveOrganizer,
    attendees: recipients,
  })
  const googleLink = buildGoogleCalendarLink({ eventTitle, selectedDate })
  const icsBase64 = Buffer.from(ics, 'utf-8').toString('base64')

  const formatter = new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })
  const formattedDate = formatter.format(selectedDate)

  await Promise.all(
    recipients.map((recipient) =>
      resend.emails.send({
        from: 'Date Planner <onboarding@resend.dev>',
        to: recipient.email,
        subject: `Date confirmée : ${eventTitle}`,
        html: `
          <!DOCTYPE html>
          <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6;">
              <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2>📅 La date est choisie !</h2>
                <p>Bonjour ${escapeHtml(recipient.name)},</p>
                <p>L'organisateur a confirmé la date pour <strong>${escapeHtml(eventTitle)}</strong>&nbsp;:</p>
                <p style="font-size: 18px; font-weight: bold;">${escapeHtml(formattedDate)}</p>
                <p>
                  Cet email est une invitation calendrier — Gmail / Google Calendar et la plupart des clients mail
                  l'ajoutent automatiquement à ton agenda avec un statut « en attente », et tu peux répondre directement
                  Oui / Non / Peut-être.
                </p>
                <p>
                  <a
                    href="${googleLink}"
                    style="display: inline-block; background-color: #1a73e8; color: white; padding: 10px 18px; border-radius: 6px; text-decoration: none;"
                  >
                    Ouvrir dans Google Calendar
                  </a>
                </p>
              </div>
            </body>
          </html>
        `,
        attachments: [
          {
            filename: 'invitation.ics',
            content: icsBase64,
            contentType: 'text/calendar; method=REQUEST; charset=UTF-8',
          },
        ],
      })
    )
  )
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
