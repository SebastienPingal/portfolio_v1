'use client'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import React, { useState } from 'react'
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
  const { toast } = useToast()
  const [CVData, setCVData] = useState<CVDataType | null>(null)
  const [language, setLanguage] = useState<string>('en')
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleImageUpload = async () => {
    console.log('📤 uploading image')
    setIsLoading(true)
    const formData = new FormData()
    if (image) {
      formData.append('image', image)
    }
    const response = await fetch('/api/sebify', {
      method: 'POST',
      body: formData,
    })

    if (response.ok) {
      const data = await response.json()
      setCVData(data.cvData)
      setLanguage(data.language === 'fr' ? 'français' : 'english')
    } else {
      toast({
        title: t('upload.errors.failed.title'),
        description: t('upload.errors.failed.description'),
        variant: 'destructive',
      })
    }
    setIsLoading(false)
  }

  return (
    <div className='flex flex-col gap-4'>
      <TalkingLogo littleHead tooltip text={t('talkingHead')} />
      <div className='flex flex-col gap-4 glassPanel' >
        <h1>{t('title')}</h1>
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file && file.size <= 5 * 1024 * 1024) {
              setImage(file)
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
          <Button type='button' onClick={handleImageUpload}>
            {isLoading ? t('upload.uploading') : t('upload.button')}
          </Button>
        )}
        {image && <p>{t('upload.imageUploaded')} {image.name} 📸</p>}
        {CVData && <CV data={CVData} language={language} isUserConnected={session.status === 'authenticated'} />}
        {/* {mockCVData && <CV data={mockCVData.cvData} language={mockCVData.language} />} */}
      </div >
    </div>
  )
}

export default CVSebifyerPage
