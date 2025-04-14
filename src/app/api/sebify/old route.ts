import { NextRequest, NextResponse } from 'next/server'
import { Anthropic } from '@anthropic-ai/sdk'
import pdf2img from 'pdf-img-convert'
import { frenchCV as myCV } from '../../../../public/json/my-cv-fr'
import { CVData } from '@/types/CV'


export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('image') as File

    if (!file) {
      console.error('❌ No file provided')
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    let base64: string

    console.log('📸 File type:', file.type)
    console.log('📏 File size:', file.size, 'bytes')

    const buffer = Buffer.from(await file.arrayBuffer())
    if (file.type === 'application/pdf') {
      console.log('🎨 Converting PDF to image...')
      const images = await pdf2img.convert(buffer)
      if (!images || images.length === 0) {
        console.error('❌ Failed to convert PDF to image')
        return NextResponse.json({ error: 'Failed to convert PDF to image' }, { status: 500 })
      }
      const firstImage = images[0]
      base64 = Buffer.from(firstImage instanceof Uint8Array ? firstImage : Buffer.from(firstImage)).toString('base64')
    } else {
      base64 = buffer.toString('base64')
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      console.error('❌ Missing Anthropic API key')
      return NextResponse.json({ error: 'Missing API key' }, { status: 500 })
    }

    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    })

    const message = await anthropic.messages.create({
      model: "claude-3-sonnet-20240229",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: "image/png",
                data: base64,
              },
            },
            {
              type: "text",
              text: `Analyze this CV image and return a JSON with two properties: 'language' (should be 'fr') and 'cvData' (matching this structure: ${JSON.stringify(myCV)}). 
              Ensure all fields are filled with appropriate data from the image. If you can't find a field, return null for that field.
              For the levels if you can't find the exact level, try to find clues and return the closest level or null. For the languages if you can't find the exact language, return the closest language.
              Try to fill the cvData with as much data as you can, but if you can't find a field, return null for that field.
              you can interpret the datas but you can't invent them.
              `
            }
          ],
        }
      ],
    })

    console.log('🤖 Claude response:', message)
    const responseData = JSON.parse((message.content[0] as { text: string }).text)
    console.log('🏈 type of responseData:', typeof responseData)
    console.log('🤖 Claude response treated:', responseData)

    return NextResponse.json(responseData)
  } catch (error) {
    console.error('❌ Error processing request:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
