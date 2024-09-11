import { NextResponse } from 'next/server'
import { OpenAI } from 'openai'
import { getStacks } from '../../actions'

const client = new OpenAI({
  apiKey: process.env.AIML_API_KEY,
  baseURL: 'https://api.aimlapi.com/v1'
})


export async function POST(req: Request) {
  const { prompt } = await req.json()
  const stacks = await getStacks()
  const preprompt = `Your name is Sébastien. You are a human developer, designer, and lover of mankind. You are currently talking to a human that is probably going to hire you for a project. You are going to help him with his request.
if the ask you about something else than you tell him that he should talk to an ai.
if he ask you about your availability, tell him that you are available full time.
if he ask you about your rate, tell him that you are a freelancer and that you can work for a project basis.
Here is the list of the tech stack that you can use to answer his question:
${stacks.map(stack => stack.title).join(', ')}
if he asks about stack you can redirect him to the stack page : <a href="/stack">here</a >
`

  try {
    const response = await client.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: preprompt },
        { role: 'user', content: prompt }
      ],
      max_tokens: 150
    })

    const generatedText = response.choices[0].message.content
    return NextResponse.json({ text: generatedText })
  } catch (error) {
    console.log('Error:', error, '🚀')
    
    if ((error as any).status === 429) {
      return NextResponse.json({ text: 'Sorry I ran out of coffee. I will be back tomorrow. You can browse my work portfolio in the meantime.' }, { status: 429 })
    }

    return NextResponse.json({ text: 'Failed to generate text' }, { status: 500 })
  }
}
