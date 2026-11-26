import Link from 'next/link'
import { getLocale, getTranslations } from 'next-intl/server'
import { Plus } from 'lucide-react'
import { auth } from '@/app/api/auth/[...nextauth]/auth'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { frenchCV } from '../../../public/json/my-cv-fr'
import { englishCV } from '../../../public/json/my-cv-en'

// Same order as the groups of `skills.stack` in the CV data files
const GROUP_KEYS = ['languages', 'frontend', 'backend', 'devops', 'tools', 'practices'] as const

const PERSONAL_PLACES = ['mon bureau', 'my office']
const NON_TECH_PLACES = ['expérience antérieure (hors tech)', 'prior experience (non-tech)']

// "Vue.js" -> "vue", "Tailwind CSS" -> "tailwindcss", "AWS Lambda" -> "awslambda"
const normalize = (value: string) => value.toLowerCase().replace(/\.?js$/, '').replace(/[^a-z0-9]/g, '')

const matches = (skill: string, used: string) => {
  const a = normalize(skill)
  const b = normalize(used)
  if (a === b) return true
  const [short, long] = a.length < b.length ? [a, b] : [b, a]
  return short.length >= 3 && long.includes(short)
}

const Rating = ({ value, label }: { value: number, label: string }) => (
  <div className="flex gap-1" aria-label={label} title={label}>
    {Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`h-2 w-2 rounded-full ${i < value ? 'bg-primary' : 'bg-primary/20'}`} />
    ))}
  </div>
)

const StackPage = async () => {
  const [session, t, locale] = await Promise.all([auth(), getTranslations('Stack'), getLocale()])
  const cv = locale === 'en' ? englishCV : frenchCV

  const experiences = (cv.experience ?? [])
    .filter(exp => !NON_TECH_PLACES.includes(exp.place?.toLowerCase() ?? ''))
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map(exp => ({
      label: PERSONAL_PLACES.includes(exp.place?.toLowerCase() ?? '') ? t('personalProjects') : exp.place ?? '',
      skills: exp.skills ?? [],
    }))

  const usedAt = (skill: string) =>
    experiences.filter(exp => exp.skills.some(used => matches(skill, used))).map(exp => exp.label)

  const groups = (cv.skills?.stack ?? []).map((group, index) => ({
    key: GROUP_KEYS[index] ?? `group${index}`,
    skills: group
      .map(skill => ({ ...skill, rating: skill.rating ?? 0, usedAt: usedAt(skill.name) }))
      .sort((a, b) => b.rating - a.rating || b.usedAt.length - a.usedAt.length),
  }))

  const isAdmin = session?.user?.email && session.user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL

  return (
    <div className="w-full flex flex-col gap-8 pt-4 sm:pt-12">
      <div className="flex flex-col gap-3">
        <h1 className="text-5xl sm:text-7xl font-black">{t('title')}</h1>
        <p className="text-lg opacity-80 max-w-2xl">{t('intro')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {groups.map(group => (
          <Card key={group.key} className="glassPanel">
            <CardHeader>
              <CardTitle>{t(`groups.${group.key}`)}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="flex flex-col gap-3">
                {group.skills.map(skill => (
                  <li key={skill.name} className="list-none flex flex-col gap-1">
                    <div className="flex items-center justify-between gap-4">
                      <span className="font-bold">{skill.name}</span>
                      <Rating value={skill.rating} label={t('rating', { value: skill.rating })} />
                    </div>
                    {skill.usedAt.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {skill.usedAt.map(place => (
                          <Badge key={place} variant="outline" className="font-normal">{place}</Badge>
                        ))}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

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
