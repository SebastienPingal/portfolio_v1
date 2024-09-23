'use client'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import React, { useState } from 'react'
import { useToast } from '@/components/ui/use-toast'

const CVSebifyerPage: React.FC = () => {
  const [image, setImage] = useState<File | null>(null)
  const { toast } = useToast()
  const [CVData, setCVData] = useState<JSON | null>(null)
  const [language, setLanguage] = useState<string>('en')
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleImageUpload = async () => {
    console.log('uploading image')
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
        title: 'Image upload failed',
        description: 'Your image upload failed',
        variant: 'destructive',
      })
    }
    setIsLoading(false)
  }

  return (
    <div className='flex flex-col gap-4 glassPanel'>
      <h1>CV Sebifyer : make your CV more seb</h1>
      <Input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file && file.size <= 5 * 1024 * 1024) {
            setImage(file)
          } else {
            toast({
              title: 'Image too large',
              description: 'Your image is too large. Please upload an image smaller than 5MB',
              variant: 'destructive',
            })
          }
        }}
      />
      {image && <Button type='button' onClick={handleImageUpload}>{isLoading ? 'Uploading...' : 'Upload'}</Button>}
      {image && <p>Image uploaded: {image.name} 📸</p>}
      {CVData && <p>CV Data: {JSON.stringify(CVData)} 📄</p>}
    </div>
  )
}

export default CVSebifyerPage