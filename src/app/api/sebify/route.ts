import { NextRequest, NextResponse } from 'next/server'
import { getCVPresets } from '@/app/actions'
import pdf2img from 'pdf-img-convert'
import { put } from '@vercel/blob'
import OpenAI from 'openai'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('image') as File
    
    if (!file) {
      console.error('❌ No file provided')
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const myCVs = await getCVPresets()
    const myCV = myCVs.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())[0]

    let base64: string
    let theBuffer: Buffer

    console.log('📸 File type:', file.type)
    console.log('📏 File size:', file.size, 'bytes')

    const buffer = Buffer.from(await file.arrayBuffer())
    if (file.type === 'application/pdf') {
      console.log('🎨 Converting PDF to image...')
      const images = await pdf2img.convert(buffer, {
        base64: true
      })
      if (!images || images.length === 0) {
        console.error('❌ Failed to convert PDF to image')
        return NextResponse.json({ error: 'Failed to convert PDF to image' }, { status: 500 })
      }
      const firstImage = images[0]
      theBuffer = Buffer.from(firstImage as Uint8Array)
      base64 = theBuffer.toString('base64')
    } else {
      base64 = buffer.toString('base64')
      theBuffer = buffer
    }

    if (!process.env.ALIBABA_API_KEY) {
      console.error('❌ Missing Alibaba API key')
      return NextResponse.json({ error: 'Missing API key' }, { status: 500 })
    }

    // Upload the image and get the URL
    const blob = await put(file.name, theBuffer, {
      access: 'public',
      contentType: file.type,
    })

    const imageUrl = blob.url
    console.log('🖼️ Image URL:', imageUrl)

    const openai = new OpenAI({
      apiKey: process.env.ALIBABA_API_KEY,
      baseURL: "https://dashscope-intl.aliyuncs.com/compatible-mode/v1"
    })

    const response = await openai.chat.completions.create({
      model: "qwen-vl-max",
      messages: [{
        role: "user", 
        content: [
          { 
            type: "image_url", 
            image_url: { "url": imageUrl } 
          },
          { 
            type: "text", 
            text: `Analyze this CV image and return a JSON with two properties: 'language' (should be 'fr') and 'cvData' (matching this structure: ${JSON.stringify(myCV)}). 
            Ensure all fields are filled with appropriate data from the image. If you can't find a field, return null for that field.
            For the levels if you can't find the exact level, try to find clues and return the closest level or null. For the languages if you can't find the exact language, return the closest language.
            Try to fill the cvData with as much data as you can, but if you can't find a field, return null for that field.
            you can interpret the datas but you can't invent them.`
          }
        ]
      }]
    })

    console.log('🤖 Qwen response:', response)
    console.log('🤖 Qwen response content:', response.choices[0].message.content)

    return NextResponse.json({ description: response.choices[0].message.content })
  } catch (error) {
    console.error('❌ Error processing request:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
