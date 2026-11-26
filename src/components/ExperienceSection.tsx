'use client'
import Link from "next/link"
import { useLocale, useTranslations } from "next-intl"
import { ArrowRight, MoveUpRight } from "lucide-react"
import { frenchCV } from "../../public/json/my-cv-fr"
import { englishCV } from "../../public/json/my-cv-en"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"

// Entries that are not professional positions (personal projects, non-tech career)
const EXCLUDED_PLACES = ['mon bureau', 'my office', 'expérience antérieure (hors tech)', 'prior experience (non-tech)']

// Strip the stack details in parentheses to keep titles short on the landing page
const shortTitle = (title: string | null) => title?.replace(/\s*\([^)]*\)/g, '').trim() ?? ''

export default function ExperienceSection() {
  const t = useTranslations('LandingPage.experience')
  const locale = useLocale()
  const cv = locale === 'en' ? englishCV : frenchCV

  const experiences = (cv.experience ?? [])
    .filter(exp => !EXCLUDED_PLACES.includes(exp.place?.toLowerCase() ?? ''))
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))

  return (
    <section className="flex flex-col gap-6 w-full">
      <h2 className="text-5xl sm:text-7xl font-black text-center">{t('title')}</h2>

      <ol className="relative flex flex-col gap-4 border-l-2 border-primary/40 ml-3 sm:ml-4">
        {experiences.map((exp, index) => {
          const isCurrent = /^(depuis|since)/i.test(exp.period ?? '')
          const summary = exp.description?.[0]

          return (
            <li key={`${exp.place}-${index}`} className="relative pl-6 sm:pl-8 list-none">
              <span
                className={`absolute -left-[9px] top-5 h-4 w-4 rounded-full border-2 border-background ${isCurrent ? 'bg-primary animate-pulse' : 'bg-primary/60'}`}
                aria-hidden
              />
              <div className="glassPanel rounded-xl p-4 flex flex-col gap-1">
                <div className="flex flex-wrap items-center gap-2">
                  {exp.link ? (
                    <a href={exp.link} target="_blank" rel="noreferrer" className="text-xl font-bold hover:underline flex items-center gap-1">
                      {exp.place}
                      <MoveUpRight className="w-4 h-4" />
                    </a>
                  ) : (
                    <span className="text-xl font-bold">{exp.place}</span>
                  )}
                  {isCurrent && <Badge variant="shine">{t('current')}</Badge>}
                </div>
                <p className="font-medium">{shortTitle(exp.title)}</p>
                <p className="text-sm uppercase opacity-70">{exp.period}</p>
                {summary && <p className="text-sm mt-1">{summary}</p>}
              </div>
            </li>
          )
        })}
      </ol>

      <Button asChild variant="secondaryshine" className="self-center">
        <Link href="/cv" className="flex gap-2 items-center">
          {t('seeCV')}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </Button>
    </section>
  )
}
