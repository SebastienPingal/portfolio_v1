import { NextRequest, NextResponse } from 'next/server'
import { frenchCV as myCV } from '../../../../public/json/my-cv-fr'
import { put, del } from '@vercel/blob'
import OpenAI from 'openai'
import { CVData, CVDataSchema } from '@/types/CV'

export const maxDuration = 60
export const runtime = 'edge'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('image') as File

    if (!file) {
      console.error('❌ No file provided')
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Define the type structure for the AI prompt (dynamically imported from CV.ts)
    const typeDefinitions = JSON.stringify(CVDataSchema, null, 2)

    console.log('📸 File type:', file.type)
    console.log('📏 File size:', file.size, 'bytes')

    const arrayBuffer = await file.arrayBuffer()

    // For now, we'll reject PDFs and ask users to convert them first
    if (file.type === 'application/pdf') {
      console.log('📄 PDF file detected')
      return NextResponse.json({
        error: 'PDF files are not supported yet. Please convert your PDF to an image (PNG/JPG) first and try again.'
      }, { status: 400 })
    }

    if (!process.env.OPENAI_API_KEY) {
      console.error('❌ Missing OpenAI API key')
      return NextResponse.json({ error: 'Missing API key' }, { status: 500 })
    }

    // Upload the file and get the URL
    const blob = await put(file.name, arrayBuffer, {
      access: 'public',
      contentType: file.type,
      addRandomSuffix: false,
    })

    const imageUrl = blob.url
    console.log('🖼️ Image URL:', imageUrl)

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    const response = await client.responses.create({
      model: "gpt-4o",
      input: [
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: `Analyze this CV image and return a JSON with two properties: 'language' (should be 'fr' if the image is in french, 'en' if it's in any other language) and 'cvData' that strictly follows these TypeScript types:

${typeDefinitions}

Follow these typing rules:
- For nullable string fields: provide the string value or null if not found
- For nullable array fields: provide an array or null if not determinable
- For nullable objects: follow their structure or null if cannot be determined
- For ratings: provide a number 1-5 or null if not possible to determine

Here is a reference structure from an existing CV: ${JSON.stringify(myCV)}

IMPORTANT: Your response must be a valid JSON object with *exactly* these two properties:
{
  "language": "fr" or "en", 
  "cvData": { ... CV data matching the types above ... }
}

Use the CV data visible in the image. You can interpret the data but don't invent information.
IMPORTANT: Return valid JSON only with no additional text, formatting, or markdown. No backticks, no code blocks, just raw JSON.`
            },
            {
              type: "input_image",
              image_url: imageUrl,
              detail: "auto"
            }
          ]
        }
      ]
    })
    console.log('🤖 OpenAI response received')

    // Parse the text response to get clean JSON
    let jsonData
    try {
      // Extract the raw text and try to parse it as JSON
      const responseText = response.output_text.trim()
      console.log('📝 Raw output:', responseText.substring(0, 100) + '...')

      // Try to extract JSON if it's wrapped in markdown code blocks
      const jsonMatch = responseText.match(/```(?:json)?([\s\S]*?)```/)
      const textToparse = jsonMatch ? jsonMatch[1].trim() : responseText

      let parsedData = JSON.parse(textToparse)
      console.log('✅ Successfully parsed JSON response')

      // Check for and fix property name issues
      if ('data' in parsedData && !('cvData' in parsedData)) {
        console.log('🔄 Converting property name from "data" to "cvData"')
        parsedData.cvData = parsedData.data
        delete parsedData.data
      }

      jsonData = parsedData
    } catch (parseError) {
      console.error('❌ Failed to parse JSON:', parseError)
      // Return the raw text if parsing fails
      return NextResponse.json({ description: response.output_text })
    }

    // Delete the blob after processing
    try {
      await del(imageUrl)
      console.log('🗑️ Deleted image blob successfully')
    } catch (deleteError) {
      console.error('⚠️ Failed to delete blob:', deleteError)
      // Continue even if delete fails
    }

    return NextResponse.json(jsonData)
  } catch (error) {
    console.error('❌ Error processing request:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
