'use client'

import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import { useTheme } from 'next-themes'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { CVProps } from '../../types/CV'
import { PDFRenderer } from '@/components/PDFRenderer'

const MeBlack = '/img/me_black.svg'
const MeWhite = '/img/me_white.svg'

const CV: React.FC<CVProps> = ({ data, language = 'en', showMe = false }: CVProps) => {

  const Section = ({ title, children }: { title?: string, children: React.ReactNode }) => (
    <section className="flex flex-col gap-2 glassPanel">
      {title && <h3>{title}</h3>}
      {children}
    </section>
  )

  const { theme } = useTheme()
  const [me, setMe] = useState(MeBlack)

  useEffect(() => {
    setMe(theme === 'light' ? MeBlack : MeWhite)
  }, [theme])

  const [showPDF, setShowPDF] = useState(true)

  if (!data) return null

  if (showPDF) {
    return (
      <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
        <div className="fixed inset-10">
          <Button
            onClick={() => setShowPDF(false)}
            className="absolute top-2 right-2 z-10"
          >
            Close
          </Button>
          <PDFRenderer data={data} language={language} theme={theme === 'light' ? 'light' : 'dark'} />
        </div>
      </div>
    )
  }

  return (
    <div className='relative'>
      <Button
        onClick={() => setShowPDF(true)}
        className='absolute top-5 right-5 z-10'
      >
        <Download className='w-4 h-4 mr-2' /> {language === 'en' ? 'Export to pdf' : 'Exporter en pdf'}
      </Button>
      <div className="glassPanel flex flex-col gap-2 aspect-[1/1.4134]">

        <header className='flex gap-2 items-center ml-8 justify-between px-4'>
          <div className='flex gap-2 items-center'>
            <div className={`relative cursor-pointer transition-transform flex-shrink-0 w-20 h-20`}>
              {showMe && <Image src={me} alt="Me" fill={true} />}
            </div>
            <div>
              <h1>{data.name}</h1>
              <p>{data.title}</p>
            </div>
          </div>
          <div>
            <p className='text-sm text-justify flex flex-col gap-1'>
              {data.contact && data.contact.email && <a href={`mailto:${data.contact.email}`}>{data.contact.email}</a>}
              {data.contact && data.contact.phone && <a href={`tel:${data.contact.phone}`}>{data.contact.phone}</a>}
              {data.contact && data.contact.location && <a href={`https://maps.google.com/?q=${data.contact.location}`}>{data.contact.location}</a>}
              {data.contact && data.contact.github && <a href={`https://${data.contact.github}`}>{data.contact.github}</a>}
            </p>
          </div>
        </header>

        {/* {data.about &&
          <Section title={language === 'en' ? 'About me' : 'À propos'}>
            <p className='text-sm text-justify'>{data.about}</p>
          </Section>
        } */}

        <Section title={language === 'en' ? 'Skills' : 'Compétences'}>
          <div className='text-sm'>
            {data?.skills?.stack && data.skills.stack.length > 0 && (
              <p>
                <span className="font-bold">{language === 'en' ? 'Technical Stack' : 'Stack Technique'}: </span>
                {data.skills.stack.map((skill, i) => (
                  `${skill.name}${i < data.skills!.stack!.length - 1 ? ' | ' : ''}`
                ))}
              </p>
            )}

            {data?.skills?.other && data.skills.other.length > 0 && (
              <p>
                <span className="font-bold">{language === 'en' ? 'Other Skills' : 'Autres Compétences'}: </span>
                {data.skills.other.map((skill, i) => (
                  `${skill.name}${i < data.skills!.other!.length - 1 ? ' | ' : ''}`
                ))}
              </p>
            )}

            {data?.languages && data?.languages?.length > 0 && (
              <p>
                <span className="font-bold">{language === 'en' ? 'Languages' : 'Langues'}: </span>
                {data.languages.map((lang, i) => (
                  `${lang.name} (${lang.level})${i < data.languages!.length - 1 ? ' | ' : ''}`
                ))}
              </p>
            )}
          </div>
        </Section>

        <div className='flex flex-col gap-2'>
          {data.experience && data.experience.length > 0 &&
            <Section title={language === 'en' ? 'Experiences' : 'Expérience Professionnelle'}>
              {data.experience && data.experience.map((exp, index) => (
                <article key={index} className='glassPanel'>
                  <h4 className='text-md'>{exp.place} - {exp.title}</h4>
                  <p className='text-sm uppercase'>{exp.period}</p>
                  <div className="pl-4">
                    <div className='text-sm'>
                      {exp.description && exp.description.map((resp, respIndex) => (
                        <p key={respIndex}>{resp}</p>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </Section>
          }

          {data.education &&
            <Section title={language === 'en' ? 'Education' : 'Formation'}>
              {data.education && data.education.map((edu, index) => (
                <article key={index} className='glassPanel'>
                  <h4 className='text-md'>{edu.title}</h4>
                  <p className='text-sm uppercase'>{edu.period}</p>
                  <div className="pl-4">
                    <div className='text-sm'>
                      {edu.description && edu.description.map((resp, respIndex) => (
                        <p key={respIndex}>{resp}</p>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </Section>
          }

        </div>
      </div>
    </div>
  )
}

export default CV