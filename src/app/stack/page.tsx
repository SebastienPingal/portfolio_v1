import Link from 'next/link'
import { getLocale, getTranslations } from 'next-intl/server'
import { Plus } from 'lucide-react'
import { auth } from '@/app/api/auth/[...nextauth]/auth'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { frenchCV } from '../../../public/json/my-cv-fr'
import { englishCV } from '../../../public/json/my-cv-en'

// Same order as the groups of `skills.stack` in the CV data files
const GROUP_KEYS = ['languages', 'frontend', 'backend', 'devops', 'tools', 'practices'] as const

const PERSONAL_PLACES = ['mon bureau', 'my office']
const NON_TECH_PLACES = ['expérience antérieure (hors tech)', 'prior experience (non-tech)']

// A tech used in at least this many positions is shown as a core skill
const CORE_MIN_POSITIONS = 2

// "Vue.js" -> "vue", "Tailwind CSS" -> "tailwindcss", "AWS Lambda" -> "awslambda"
const normalize = (value: string) => value.toLowerCase().replace(/\.?js$/, '').replace(/[^a-z0-9]/g, '')

const matches = (skill: string, used: string) => {
  const a = normalize(skill)
  const b = normalize(used)
  if (a === b) return true
  const [short, long] = a.length < b.length ? [a, b] : [b, a]
  return short.length >= 3 && long.includes(short)
}

const StackPage = async () => {
  const [session, t, locale] = await Promise.all([auth(), getTranslations('Stack'), getLocale()])
  const cv = locale === 'en' ? englishCV : frenchCV

  const experiences = (cv.experience ?? [])
    .filter(exp => !NON_TECH_PLACES.includes(exp.place?.toLowerCase() ?? ''))
    .map(exp => ({
      label: PERSONAL_PLACES.includes(exp.place?.toLowerCase() ?? '') ? t('personalProjects') : exp.place ?? '',
      isPersonal: PERSONAL_PLACES.includes(exp.place?.toLowerCase() ?? ''),
      skills: exp.skills ?? [],
    }))

  const groups = (cv.skills?.stack ?? []).map((group, index) => ({
    key: GROUP_KEYS[index] ?? `group${index}`,
    skills: group
      .map(skill => {
        const usedAt = experiences.filter(exp => exp.skills.some(used => matches(skill.name, used)))
        const positions = usedAt.filter(exp => !exp.isPersonal).length
        return { name: skill.name, usedAt: usedAt.map(exp => exp.label), isCore: positions >= CORE_MIN_POSITIONS, positions }
      })
      .sort((a, b) => Number(b.isCore) - Number(a.isCore) || b.positions - a.positions),
  }))

  const isAdmin = session?.user?.email && session.user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL

  return (
    <div className="w-full flex flex-col gap-10 pt-4 sm:pt-12">
      <div className="flex flex-col gap-3">
        <h1 className="text-5xl sm:text-7xl font-black">{t('title')}</h1>
        <p className="text-lg opacity-80 max-w-2xl">{t('intro')}</p>
        <div className="flex flex-wrap items-center gap-4 text-sm opacity-80">
          <span className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-primary" aria-hidden /> {t('legend.core')}
          </span>
          <span className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full border border-foreground/40" aria-hidden /> {t('legend.other')}
          </span>
        </div>
      </div>

      <TooltipProvider delayDuration={100}>
        <div className="glassPanel rounded-2xl divide-y divide-foreground/10">
          {groups.map(group => (
            <section key={group.key} className="flex flex-col sm:flex-row gap-3 sm:gap-6 p-5 sm:p-6">
              <h2 className="text-sm font-bold uppercase tracking-wider opacity-60 sm:w-44 sm:flex-shrink-0 sm:pt-2">
                {t(`groups.${group.key}`)}
              </h2>
              <div className="flex flex-wrap items-center gap-2">
                {group.skills.map(skill => {
                  const chip = (
                    <span
                      className={skill.isCore
                        ? 'rounded-full bg-primary text-primary-foreground font-bold px-4 py-1.5 text-base shadow-sm cursor-default'
                        : 'rounded-full border border-foreground/20 bg-background/50 px-3 py-1 text-sm cursor-default'}
                    >
                      {skill.name}
                    </span>
                  )

                  if (skill.usedAt.length === 0) return <span key={skill.name}>{chip}</span>

                  return (
                    <Tooltip key={skill.name}>
                      <TooltipTrigger asChild>{chip}</TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p className="text-xs opacity-70 mb-1">{t('usedAt')}</p>
                        <p className="text-sm">{skill.usedAt.join(' · ')}</p>
                      </TooltipContent>
                    </Tooltip>
                  )
                })}
              </div>
            </section>
          ))}
        </div>
      </TooltipProvider>

      {isAdmin && (
        <Link href="/stack/new" className="self-start">
          <Button className="flex gap-2">
            <Plus className="h-4 w-4" />
            {t('addTech.button')}
          </Button>
        </Link>
      )}
    </div>
  )
}

export default StackPage
