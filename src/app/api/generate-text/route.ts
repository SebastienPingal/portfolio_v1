import { NextResponse } from 'next/server'
import { OpenAI } from 'openai'
import { getStacks } from '../../actions'
import { getTranslations } from 'next-intl/server'

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  const { prompt, locale = 'en' } = await req.json()
  const stacks = await getStacks()
  const t = await getTranslations('API.generateText')

  // const preprompt = t('preprompt', {
  //   stacks: stacks.map(stack => stack.title).join(', ')
  // })

  try {
    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      store: true,
      messages: [
        { role: 'system', content: "tu es bob benco" },
        { role: 'user', content: 'qui es tu ?' }
      ],
    })

    const generatedText = response.choices[0].message.content
    return NextResponse.json({ text: generatedText })
  } catch (error) {
    console.log('❌ API Error:', error)

    if ((error as any).status === 429) {
      return NextResponse.json({ text: t('errors.rateLimited') }, { status: 429 })
    }

    return NextResponse.json({ text: t('errors.generic') }, { status: 500 })
  }
}
