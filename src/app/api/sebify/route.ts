import { NextRequest, NextResponse } from 'next/server'
import { getCVPresets } from '@/app/actions'
import pdf2img from 'pdf-img-convert'
import { put } from '@vercel/blob'
import OpenAI from 'openai'

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const file = formData.get('image') as File
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
    const firstImage = images[0]
    theBuffer = Buffer.from(firstImage)
    base64 = theBuffer.toString('base64')
  } else {
    base64 = buffer.toString('base64')
    theBuffer = buffer
  }

  // Upload the image and get the URL
  const blob = await put(file.name, theBuffer, {
    access: 'public',
    contentType: file.type, // Set the correct MIME type
  })

  const imageUrl = blob.url
  console.log('🖼️ Image URL:', imageUrl)

  // Prepare the message for the model
  const input = `Analyze this CV image and return a JSON with two properties: 'language' (should be 'fr') and 'cvData' (matching this structure: ${JSON.stringify(myCV)}). 
            Ensure all fields are filled with appropriate data from the image. If you can't find a field, return null for that field.
            For the levels if you can't find the exact level, try to find clues and return the closest level or null. For the languages if you can't find the exact language, return the closest language.
            Try to fill the cvData with as much data as you can, but if you can't find a field, return null for that field.
            you can interpret the datas but you can't invent them.
            `

  // Initialize Hugging Face Inference
  const openai = new OpenAI({
    apiKey: process.env.ALIBABA_API_KEY,
    baseURL: "https://dashscope-intl.aliyuncs.com/compatible-mode/v1"
  })

  // Use the imageToText method
  const response = await openai.chat.completions.create({
    model: "qwen-vl-max",
    messages: [{
      role: "user", content: [
        { type: "image_url", image_url: { "url": imageUrl } },
        { type: "text", text: input }
      ]
    }]
  },
  )

  console.log('🖼️ Salesforce/blip-image-captioning-base response:', response)
  console.log('🖼️ Salesforce/blip-image-captioning-base response:', response.choices[0].message.content)

  return NextResponse.json({ description: response.choices[0].message.content })
}
