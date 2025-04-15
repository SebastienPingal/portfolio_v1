import { NextRequest, NextResponse } from 'next/server'
import { frenchCV as myCV } from '../../../../public/json/my-cv-fr'
import { put, del } from '@vercel/blob'
import OpenAI from 'openai'
import fs from 'fs'
import path from 'path'
import { promisify } from 'util'
import { exec } from 'child_process'

const execPromise = promisify(exec)

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('image') as File

    if (!file) {
      console.error('❌ No file provided')
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Dynamically read the CV type definitions
    const cvTypesPath = path.join(process.cwd(), 'src', 'types', 'CV.ts')
    const cvTypesContent = await fs.promises.readFile(cvTypesPath, 'utf-8')
    
    // Extract the type definitions for the prompt
    const typeDefinitions = cvTypesContent
      .replace(/export type.*$/m, '') // Remove export statements
      .trim()

    let theBuffer: Buffer

    console.log('📸 File type:', file.type)
    console.log('📏 File size:', file.size, 'bytes')

    const buffer = Buffer.from(await file.arrayBuffer())

    if (file.type === 'application/pdf') {
      console.log('🎨 Converting PDF to image using pdftoppm...')

      // Create a temporary file to store the PDF
      const tempDir = '/tmp'
      const tempId = Date.now()
      const tempPdfPath = path.join(tempDir, `temp-${tempId}.pdf`)
      const tempPngPrefix = path.join(tempDir, `temp-${tempId}`)

      try {
        // Write the PDF buffer to a temp file
        await fs.promises.writeFile(tempPdfPath, buffer)

        // Use pdftoppm to convert the first page to PNG at 300 DPI
        const { stdout, stderr } = await execPromise(
          `pdftoppm -png -singlefile -r 300 ${tempPdfPath} ${tempPngPrefix}`
        )

        console.log('📄 pdftoppm stdout:', stdout)
        if (stderr) console.log('⚠️ pdftoppm stderr:', stderr)

        // Read the resulting PNG file - pdftoppm doesn't add the -1 suffix when using -singlefile
        const outputPngPath = `${tempPngPrefix}.png`
        console.log('🔍 Looking for output file at:', outputPngPath)

        theBuffer = await fs.promises.readFile(outputPngPath)
        console.log('✅ PDF converted to image successfully')

        // Clean up temp files
        await fs.promises.unlink(tempPdfPath)
        await fs.promises.unlink(outputPngPath)
      } catch (conversionError) {
        console.error('❌ Error converting PDF to image:', conversionError)
        return NextResponse.json({ error: 'Failed to convert PDF to image' }, { status: 500 })
      }
    } else {
      theBuffer = buffer
    }

    if (!process.env.OPENAI_API_KEY) {
      console.error('❌ Missing OpenAI API key')
      return NextResponse.json({ error: 'Missing API key' }, { status: 500 })
    }

    // Upload the image and get the URL
    const blob = await put(file.name, theBuffer, {
      access: 'public',
      contentType: file.type === 'application/pdf' ? 'image/png' : file.type,
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
