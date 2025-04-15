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
      console.log('🤖 OpenAI response received', data)
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
          accept="image/*,.pdf"
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
        {CVData && <CV data={mockedCVData.cvData} language={language} isUserConnected={session.status === 'authenticated'} />}
      </div >
    </div>
  )
}

export default CVSebifyerPage
