import { NextResponse } from 'next/server'
import { OpenAI } from 'openai'
import { getStacks } from '../../actions'
import { getTranslations } from 'next-intl/server'
import { frenchCV } from '../../../../public/json/my-cv-fr'
import { englishCV } from '../../../../public/json/my-cv-en'

const MAX_PROMPT_LENGTH = 500

// Best-effort rate limit (in memory, per server instance) to protect the OpenAI bill
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000
const RATE_LIMIT_MAX_REQUESTS = 10
const requestLog = new Map<string, number[]>()

const isRateLimited = (key: string) => {
  const now = Date.now()
  const recent = (requestLog.get(key) ?? []).filter(time => now - time < RATE_LIMIT_WINDOW_MS)
  if (recent.length >= RATE_LIMIT_MAX_REQUESTS) {
    requestLog.set(key, recent)
    return true
  }
  recent.push(now)
  requestLog.set(key, recent)
  if (requestLog.size > 5000) requestLog.clear()
  return false
}

const SUPPORTED_LOCALES = ['fr', 'en'] as const

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  const prompt = typeof body.prompt === 'string' ? body.prompt.trim() : ''
  const locale = SUPPORTED_LOCALES.includes(body.locale) ? body.locale : 'fr'

  const t = await getTranslations({ locale, namespace: 'API.generateText' })

  if (!prompt) {
    return NextResponse.json({ text: t('errors.emptyPrompt') }, { status: 400 })
  }
  if (prompt.length > MAX_PROMPT_LENGTH) {
    return NextResponse.json({ text: t('errors.tooLong', { max: MAX_PROMPT_LENGTH }) }, { status: 400 })
  }

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  if (isRateLimited(ip)) {
    return NextResponse.json({ text: t('errors.rateLimited') }, { status: 429 })
  }

  const stacks = await getStacks()
  const cv = locale === 'en' ? englishCV : frenchCV
  const experience = cv.experience
    .map(exp => `- ${exp.place} — ${exp.title} (${exp.period})`)
    .join('\n')

  const preprompt = t('preprompt', {
    stacks: stacks.map(stack => stack.title).join(', '),
    about: cv.about,
    experience,
    stackLink: `<a href="/stack">${locale === 'en' ? 'stack page' : 'page stack'}</a>`,
  })

  try {
    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      max_tokens: 400,
      messages: [
        { role: 'system', content: preprompt },
        { role: 'user', content: prompt },
      ],
    })

    const generatedText = response.choices[0]?.message.content ?? t('errors.generic')
    return NextResponse.json({ text: generatedText })
  } catch (error) {
    console.error('❌ API Error:', error)

    if ((error as { status?: number }).status === 429) {
      return NextResponse.json({ text: t('errors.rateLimited') }, { status: 429 })
    }

    return NextResponse.json({ text: t('errors.generic') }, { status: 500 })
  }
}
