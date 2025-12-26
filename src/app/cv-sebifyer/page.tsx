'use client'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import React, { useState, useEffect } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { PDFRenderer } from '@/components/PDFRenderer'
import { PDFRendererDense } from '@/components/PDFRendererDense'
import { CVData as CVDataType } from '@/types/CV'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import TalkingLogo from '@/components/TalkingLogo'
import { useTheme } from 'next-themes'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const CVSebifyerPage: React.FC = () => {
  const t = useTranslations('CVSebifyer')
  const session = useSession()
  const { theme } = useTheme()
  const [image, setImage] = useState<File | null>(null)
  const [processedImage, setProcessedImage] = useState<File | null>(null)
  const { toast } = useToast()
  const [CVData, setCVData] = useState<CVDataType | null>(null)
  const [language, setLanguage] = useState<'en' | 'fr'>('en')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isProcessingPdf, setIsProcessingPdf] = useState<boolean>(false)
  const [pdfjsLib, setPdfjsLib] = useState<any>(null)
  const [rendererVariant, setRendererVariant] = useState<'classic' | 'dense'>('classic')

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
        setLanguage(data.language === 'fr' ? 'fr' : 'en')
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
        <div className='flex gap-2 items-center'>
          <div className='text-sm'>Renderer</div>
          <Select value={rendererVariant} onValueChange={(v) => setRendererVariant(v as 'classic' | 'dense')}>
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="classic">Classic</SelectItem>
              <SelectItem value="dense">Dense</SelectItem>
            </SelectContent>
          </Select>
        </div>
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
        {CVData && (
          <div className='w-full h-[80vh]'>
            {rendererVariant === 'dense' ? (
              <PDFRendererDense
                data={CVData}
                language={language}
                theme={theme === 'light' ? 'light' : 'dark'}
              />
            ) : (
              <PDFRenderer
                data={CVData}
                language={language}
                theme={theme === 'light' ? 'light' : 'dark'}
              />
            )}
          </div>
        )}
      </div >
    </div>
  )
}

export default CVSebifyerPage
