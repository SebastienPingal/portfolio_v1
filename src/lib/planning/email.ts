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

function escapeICS(value: string) {
  return value.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n')
}

function buildICS({ eventTitle, eventId, selectedDate }: { eventTitle: string; eventId: string; selectedDate: Date }) {
  const start = toICSDate(selectedDate)
  const next = new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000)
  const end = toICSDate(next)
  const stamp =
    `${new Date().getUTCFullYear()}${pad(new Date().getUTCMonth() + 1)}${pad(new Date().getUTCDate())}` +
    `T${pad(new Date().getUTCHours())}${pad(new Date().getUTCMinutes())}${pad(new Date().getUTCSeconds())}Z`

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Portfolio//Date Planner//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:REQUEST',
    'BEGIN:VEVENT',
    `UID:date-planner-${eventId}@portfolio`,
    `DTSTAMP:${stamp}`,
    `DTSTART;VALUE=DATE:${start}`,
    `DTEND;VALUE=DATE:${end}`,
    `SUMMARY:${escapeICS(eventTitle)}`,
    `DESCRIPTION:${escapeICS(`Date confirmée pour ${eventTitle}.`)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
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
}: SendSelectedDateInput) {
  if (!process.env.RESEND_API_KEY || recipients.length === 0) return

  const resend = new Resend(process.env.RESEND_API_KEY)
  const ics = buildICS({ eventTitle, eventId, selectedDate })
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
                  <a
                    href="${googleLink}"
                    style="display: inline-block; background-color: #1a73e8; color: white; padding: 10px 18px; border-radius: 6px; text-decoration: none;"
                  >
                    Ajouter à Google Calendar
                  </a>
                </p>
                <p style="font-size: 13px; color: #6c757d;">
                  Une invitation est également jointe à ce mail (fichier .ics) — la plupart des clients mail proposent
                  automatiquement de l'ajouter au calendrier.
                </p>
              </div>
            </body>
          </html>
        `,
        attachments: [
          {
            filename: 'invitation.ics',
            content: icsBase64,
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
