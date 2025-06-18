'use client'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import React, { useState, useEffect } from 'react'
import { useToast } from '@/components/ui/use-toast'
import CV from '../cv/CV'
import { CVData as CVDataType } from '@/types/CV'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import TalkingLogo from '@/components/TalkingLogo'

const CVSebifyerPage: React.FC = () => {
  const t = useTranslations('CVSebifyer')
  const session = useSession()
  const [image, setImage] = useState<File | null>(null)
  const [processedImage, setProcessedImage] = useState<File | null>(null)
  const { toast } = useToast()
  const [CVData, setCVData] = useState<CVDataType | null>(null)
  const [language, setLanguage] = useState<string>('en')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isProcessingPdf, setIsProcessingPdf] = useState<boolean>(false)
  const [pdfjsLib, setPdfjsLib] = useState<any>(null)

  // Initialize PDF.js only on client side
  useEffect(() => {
    const initPdfJs = async () => {
      try {
        const pdfjs = await import('pdfjs-dist')
        pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs'
        setPdfjsLib(pdfjs)
        console.log('📚 PDF.js initialized successfully')
      } catch (error) {
        console.error('❌ Failed to initialize PDF.js:', error)
      }
    }
    
    initPdfJs()
  }, [])

  const mockedCVData = {
    "language": "en",
    "cvData": {
      "name": "Sébastien Pingal",
      "title": "Fullstack Developer",
      "contact": [
        { "key": "github", "value": "github.com/SebastienPingal", "link": "https://github.com/SebastienPingal" },
        { "key": "email", "value": "sebastien.pingal@gmail.com", "link": "mailto:sebastien.pingal@gmail.com" },
        { "key": "phone", "value": "(+33) 07 77 93 91 02", "link": "tel:+33777939102" },
        { "key": "location", "value": "Nanterre, France", "link": "https://www.google.com/maps/place/Nanterre,+France" }
      ],
      "languages": [
        { "name": "French", "level": "Native" },
        { "name": "English", "level": "Fluent" },
        { "name": "German", "level": "B2 Level" }
      ],
      "activities": null,
      "skills": {
        "stack": [
          [{ "name": "TypeScript", "rating": null }, { "name": "Next", "rating": null }],
          [{ "name": "Vue / Nuxt", "rating": null }],
          [{ "name": "JS / Node.js", "rating": null }],
          [{ "name": "PostgreSQL", "rating": null }],
          [{ "name": "Jest", "rating": null }],
          [{ "name": "Stripe", "rating": null }]
        ],
        "other": [
          { "name": "Teaching", "rating": null },
          { "name": "Psychology", "rating": null },
          { "name": "Clean Code", "rating": null },
          { "name": "Mathematics", "rating": null },
          { "name": "Photoshop", "rating": null },
          { "name": "Figma (UX/UI)", "rating": null }
        ]
      },
      "education": [
        {
          "title": "Online Courses and Mentorship",
          "place": "Udemy and Personal Mentorship",
          "period": "2022 - Present",
          "description": [
            "Following various courses on Udemy to acquire knowledge",
            "Benefiting from the guidance of a friend as a mentor",
            "Working on projects that have allowed me to apply my skills"
          ]
        }
      ],
      "experience": [
        {
          "title": "CTO",
          "place": "Moneo Domus",
          "period": "Since March 2024",
          "description": [
            "Creation of a project management website from scratch (Next, PostgreSQL, Vercel)",
            "Design"
          ]
        },
        {
          "title": "Entrepreneur and Fullstack Developer",
          "place": "KAFO",
          "period": "January 2023 - January 2024",
          "description": [
            "100% recoding of the front-end (Vue 3, TS)",
            "Implementation of an interactive map (Mapbox, JavaScript)",
            "Setting up a no-code website (Weweb, Xano, JavaScript)",
            "Implementation of unit and e2e tests (Vitest and Cypress)",
            "Database structure design (MySQL)"
          ]
        },
        {
          "title": "Fullstack Developer",
          "place": "Art Factory",
          "period": "Since November 2023",
          "description": [
            "Creation of an event management website from scratch (Next)"
          ]
        },
        {
          "title": "Fullstack Developer",
          "place": "Aestima Immo",
          "period": "Since September 2022",
          "description": [
            "Implementation of PDF export (scraping with Puppeteer)",
            "Database setup (MongoDB)",
            "Server maintenance and feature addition (Node, Vue 2, Express)",
            "Use of Stripe for subscription implementation"
          ]
        }
      ],
      "about": "I am a reliable and resourceful person who loves challenges. I made a career change 2 years ago to become a developer, after working as a sound engineer, composer, and teacher for 6 years. I'm now looking for a new project to dedicate myself to.",
      "profileImage": null,
      "profileImageDark": null
    }
  }

  // Convert PDF to image on the client side
  const convertPdfToImage = async (pdfFile: File): Promise<File> => {
    if (!pdfjsLib) {
      throw new Error('PDF.js not initialized yet')
    }

    console.log('🎨 Converting PDF to image on client side...')
    setIsProcessingPdf(true)

    try {
      const arrayBuffer = await pdfFile.arrayBuffer()
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
      const page = await pdf.getPage(1) // Get first page

      // Create canvas for rendering
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')!
      
      // Set high quality scale (300 DPI equivalent)
      const scale = 2
      const viewport = page.getViewport({ scale })
      
      canvas.height = viewport.height
      canvas.width = viewport.width

      // Render PDF page to canvas
      await page.render({
        canvasContext: context,
        viewport: viewport
      }).promise

      console.log('✅ PDF rendered to canvas successfully')

      // Convert canvas to blob
      return new Promise((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) {
            const imageFile = new File([blob], pdfFile.name.replace('.pdf', '.png'), {
              type: 'image/png',
              lastModified: Date.now()
            })
            console.log('✅ PDF converted to PNG successfully')
            resolve(imageFile)
          }
        }, 'image/png', 0.95) // High quality PNG
      })
    } catch (error) {
      console.error('❌ Error converting PDF to image:', error)
      throw new Error('Failed to convert PDF to image')
    } finally {
      setIsProcessingPdf(false)
    }
  }

  const handleImageUpload = async () => {
    console.log('📤 uploading image')
    setIsLoading(true)
    
    try {
      let fileToUpload = processedImage || image
      
      // If original file is PDF and we haven't processed it yet, convert it first
      if (image && image.type === 'application/pdf' && !processedImage) {
        console.log('🔄 PDF detected, converting to image...')
        fileToUpload = await convertPdfToImage(image)
        setProcessedImage(fileToUpload)
      }

      if (!fileToUpload) {
        throw new Error('No file to upload')
      }

      const formData = new FormData()
      formData.append('image', fileToUpload)
      
      const response = await fetch('/api/sebify', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        console.log('🤖 OpenAI response received', data)
        setCVData(data.cvData)
        setLanguage(data.language === 'fr' ? 'français' : 'english')
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Upload failed')
      }
    } catch (error) {
      console.error('❌ Upload error:', error)
      toast({
        title: t('upload.errors.failed.title'),
        description: error instanceof Error ? error.message : t('upload.errors.failed.description'),
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='flex flex-col gap-4'>
      <TalkingLogo littleHead tooltip text={t('talkingHead')} />
      <div className='flex flex-col gap-4 glassPanel' >
        <h1>{t('title')}</h1>
        <Input
          type="file"
          accept="image/*,.pdf"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file && file.size <= 5 * 1024 * 1024) {
              setImage(file)
              setProcessedImage(null) // Reset processed image when new file is selected
            } else {
              toast({
                title: t('upload.errors.tooLarge.title'),
                description: t('upload.errors.tooLarge.description'),
                variant: 'destructive',
              })
            }
          }}
        />
        {image && (
          <Button 
            type='button' 
            onClick={handleImageUpload} 
            disabled={isLoading || isProcessingPdf || (image.type === 'application/pdf' && !pdfjsLib)}
          >
            {isProcessingPdf ? '🎨 Converting PDF...' : isLoading ? t('upload.uploading') : t('upload.button')}
          </Button>
        )}
        {image && <p>{t('upload.imageUploaded')} {image.name} 📸</p>}
        {CVData && <CV data={mockedCVData.cvData} language={language} isUserConnected={session.status === 'authenticated'} />}
      </div >
    </div>
  )
}

export default CVSebifyerPage
