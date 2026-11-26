// Helpers to keep CV periods and durations up to date automatically.
// Dates are 'YYYY-MM' strings; durations are counted in whole months, start and end months included.

type CVLocale = 'fr' | 'en'

const MONTHS: Record<CVLocale, string[]> = {
  fr: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
}

const parse = (value: string) => {
  const [year, month] = value.split('-').map(Number)
  return { year, month }
}

const currentMonth = () => {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

export const monthsBetween = (start: string, end: string = currentMonth()) => {
  const s = parse(start)
  const e = parse(end)
  return (e.year - s.year) * 12 + (e.month - s.month) + 1
}

/** Whole years elapsed since `start` (e.g. years of experience). */
export const yearsSince = (start: string) => Math.floor((monthsBetween(start) - 1) / 12)

const capitalize = (value: string) => value.charAt(0).toUpperCase() + value.slice(1)

const formatMonth = (value: string, locale: CVLocale) => {
  const { year, month } = parse(value)
  return `${MONTHS[locale][month - 1]} ${year}`
}

export const formatDuration = (months: number, locale: CVLocale) => {
  if (months < 12) {
    return locale === 'fr' ? `${months} mois` : `${months} month${months > 1 ? 's' : ''}`
  }
  // Rounded down to the half year, so durations are never overstated
  const years = Math.floor(months / 6) / 2
  if (locale === 'fr') {
    return `${String(years).replace('.', ',')} an${years >= 2 ? 's' : ''}`
  }
  return `${years} year${years === 1 ? '' : 's'}`
}

/**
 * Builds a CV period label with its duration.
 * - With an end date: "Janvier 2024 - Septembre 2025 (1,5 an)"
 * - Ongoing: "Depuis avril 2026 (8 mois)" / "Since April 2026 (8 months)"
 */
export const cvPeriod = (start: string, end: string | null, locale: CVLocale) => {
  const duration = formatDuration(monthsBetween(start, end ?? undefined), locale)
  if (end) {
    return `${capitalize(formatMonth(start, locale))} - ${capitalize(formatMonth(end, locale))} (${duration})`
  }
  const since = locale === 'fr' ? 'Depuis' : 'Since'
  return `${since} ${formatMonth(start, locale)} (${duration})`
}

export const DEV_CAREER_START = '2021-06'
