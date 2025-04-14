import { NextRequest, NextResponse } from 'next/server'
import { getCVPresets } from '@/app/actions'
import { put } from '@vercel/blob'
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

    const myCVs = await getCVPresets()
    const myCV = myCVs.sort((a: { updatedAt: string | number | Date }, b: { updatedAt: string | number | Date }) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )[0]

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
        
        // List files in the temp directory to see what was created
        const { stdout: lsOutput } = await execPromise(`ls -la ${tempDir}`)
        console.log('📁 Files in temp directory:', lsOutput)
        
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

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
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
