'use client'

import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Download } from 'lucide-react'
import { useTheme } from 'next-themes'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { usePDF } from 'react-to-pdf'
import { CVProps } from '../../types/CV'

const MeBlack = '/img/me_black.svg'
const MeWhite = '/img/me_white.svg'

const CV: React.FC<CVProps> = ({ data, language = 'en', showMe = false }: CVProps) => {

  const Section = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <section className="flex flex-col gap-2 glassPanel">
      <h3>{title}</h3>
      {children}
    </section>
  )

  const { theme } = useTheme()
  const { toPDF, targetRef } = usePDF({ filename: 'CV.pdf' })

  const handleExportPDF = () => {
    console.log('handleExportPDF called')

    if (!targetRef.current) {
      console.error('targetRef is not set')
      return
    }

    const exportColor = theme === 'light' ? '#FFE6FF' : '#282D28'
    const exportTextColor = theme === 'light' ? '#000000' : '#E8FFE8'
    const originalBg = targetRef.current.style.backgroundColor
    const originalTextColor = targetRef.current.style.color

    targetRef.current.style.backgroundColor = exportColor
    targetRef.current.style.color = exportTextColor
    document.body.style.backgroundColor = exportColor

    console.log('Export styles:', {
      backgroundColor: targetRef.current.style.backgroundColor,
      color: targetRef.current.style.color
    })

    toPDF()
    setTimeout(() => {
      targetRef.current.style.backgroundColor = originalBg
      targetRef.current.style.color = originalTextColor
      document.body.style.backgroundColor = ''
    }, 500)
  }

  const [me, setMe] = useState(MeBlack)

  useEffect(() => {
    setMe(theme === 'light' ? MeBlack : MeWhite)
  }, [theme])

  if (!data) return null

  return (
    <div className='relative'>
      <Button onClick={handleExportPDF} className='absolute top-5 right-5 z-10'>
        <Download className='w-4 h-4 mr-2' /> {language === 'en' ? 'Export to pdf' : 'Exporter en pdf'}
      </Button>
      <div className="glassPanel flex flex-col gap-2 aspect-[1/1.4134]" ref={targetRef}>

        <header className='flex gap-2 items-center ml-8'>
          {showMe && <Image src={me} alt="Me" width={50} height={50} />}
          <div>
            <h1>{data.name}</h1>
            <p>{data.title}</p>
          </div>
        </header>

        {data.about &&
          <Section title={language === 'en' ? 'About me' : 'À propos'}>
            <p className='text-sm text-justify'>{data.about}</p>
          </Section>
        }


        <div className='flex gap-2'>
          <div className='flex flex-col gap-2 w-1/4'>
            <Section title="Contact">
              <p className='text-sm text-justify flex flex-col gap-1'>
                {data.contact && data.contact.github && <a href={`https://${data.contact.github}`}>{data.contact.github}</a>}
                {data.contact && data.contact.email && <a href={`mailto:${data.contact.email}`}>{data.contact.email}</a>}
                {data.contact && data.contact.phone && <a href={`tel:${data.contact.phone}`}>{data.contact.phone}</a>}
                {data.contact && data.contact.location && <a href={`https://maps.google.com/?q=${data.contact.location}`}>{data.contact.location}</a>}
              </p>
            </Section>

            {data.languages && data.languages.length > 0 &&
              <Section title={language === 'en' ? 'Languages' : 'Langues'}>
                <div className='text-sm text-justify'>
                  {data.languages && data.languages.map((lang, index) => (
                    <p key={index}>{lang.name}: {lang.level}</p>
                  ))}
                </div>
              </Section>
            }

            {data.skills && data.skills.stack &&
              <Section title={language === 'en' ? 'Stack' : 'Technologies'}>
                <div className="flex flex-col gap-1">
                  {data.skills && data.skills.stack && data.skills.stack.map((skill, index) => (
                    <div key={index} className='flex flex-col gap-1'>
                      <span className="whitespace-nowrap text-sm">{skill.name}</span>
                      {skill.rating && <Progress value={skill.rating * 20} className="w-full h-1" />}
                    </div>
                  ))}
                </div>
              </Section>}

            {data.skills && data.skills.other &&
              <Section title={language === 'en' ? 'Other skills' : 'Autres Compétences'}>
                <div className="flex flex-col gap-1">
                  {data.skills && data.skills.other && data.skills.other.map((skill, index) => (
                    <div key={index} className='flex flex-col gap-1'>
                      <span className="whitespace-nowrap text-sm">{skill.name}</span>
                      {skill.rating && <Progress value={skill.rating * 20} className="w-full h-1" />}
                    </div>
                  ))}
                </div>
              </Section>
            }

          </div>

          <div className='flex flex-col gap-2'>
            {data.experience && data.experience.length > 0 &&
              <Section title={language === 'en' ? 'Experiences' : 'Expérience Professionnelle'}>
                {data.experience && data.experience.map((exp, index) => (
                  <article key={index} className='glassPanel'>
                    <h4 className='text-md'>{exp.title}</h4>
                    <p className='text-sm uppercase font-bold'>{exp.place}</p>
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
                    <p className='text-sm uppercase font-bold'>{edu.place}</p>
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
    </div>
  )
}

export default CV