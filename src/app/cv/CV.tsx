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

const CV: React.FC<CVProps> = ({ data, language }) => {

  const Section = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <section className="flex flex-col gap-2 glassPanel">
      <h3>{title}</h3>
      {children}
    </section>
  );

  const { theme } = useTheme()
  const { toPDF, targetRef } = usePDF({ filename: 'CV.pdf' })

  const handleExportPDF = () => {
    const exportColor = theme === 'light' ? '#FFE6FF' : '#282D28'
    const originalBg = targetRef.current.style.backgroundColor
    const style = document.createElement('style')
    style.textContent = `
    .glassPanel {
      border-radius: 0 !important;
    }
  `
    document.head.appendChild(style)
    targetRef.current.style.backgroundColor = exportColor
    document.body.style.backgroundColor = exportColor
    toPDF()
    setTimeout(() => {
      targetRef.current.style.backgroundColor = originalBg
      document.body.style.backgroundColor = ''
      document.head.removeChild(style)
    }, 500)
  }

  const [me, setMe] = useState(MeBlack)

  useEffect(() => {
    setMe(theme === 'light' ? MeBlack : MeWhite)
  }, [theme])

  return (
    <div className='relative'>
      <Button onClick={handleExportPDF} className='absolute top-5 right-5 z-10'>
        <Download className='w-4 h-4 mr-2' /> {language === 'en' ? 'Export to pdf' : 'Exporter en pdf'}
      </Button>
      <div className="glassPanel flex flex-col gap-4 aspect-[1/1.4134]" ref={targetRef}>

        <header className='flex gap-4 items-center ml-8'>
          <Image src={me} alt="Me" width={50} height={50} />
          <div>
            <h1>{data.name}</h1>
            <p>{data.title}</p>
          </div>
        </header>

        <Section title={language === 'en' ? 'About me' : 'À propos'}>
          <p className='text-sm text-justify'>{data.about}</p>
        </Section>


        <div className='flex gap-4'>
          <div className='flex flex-col gap-4 w-1/4'>
            <Section title="Contact">
              <p className='text-sm text-justify'>
                <a href={`https://${data.contact.github}`}>{data.contact.github}</a><br />
                <a href={`mailto:${data.contact.email}`}>{data.contact.email}</a><br />
                <a href={`tel:${data.contact.phone}`}>{data.contact.phone}</a><br />
                <a href={`https://maps.google.com/?q=${data.contact.location}`}>{data.contact.location}</a>
              </p>
            </Section>

            <Section title={language === 'en' ? 'Languages' : 'Langues'}>
              <div className='text-sm text-justify'>
                {data.languages.map((lang, index) => (
                  <p key={index}>{lang.name}: {lang.level}</p>
                ))}
              </div>
            </Section>

            <Section title={language === 'en' ? 'Stack' : 'Technologies'}>
              <div className="flex flex-col gap-1">
                {data.skills.stack.map((skill, index) => (
                  <div key={index} className='flex flex-col gap-1'>
                    <span className="whitespace-nowrap text-sm">{skill.name}</span>
                    <Progress value={skill.rating * 20} className="w-full h-1" />
                  </div>
                ))}
              </div>
            </Section>

            <Section title={language === 'en' ? 'Other skills' : 'Autres Compétences'}>
              <div className="flex flex-col gap-1">
                {data.skills.other.map((skill, index) => (
                  <div key={index} className='flex flex-col gap-1'>
                    <span className="whitespace-nowrap text-sm">{skill.name}</span>
                    <Progress value={skill.rating * 20} className="w-full h-1" />
                  </div>
                ))}
              </div>
            </Section>

          </div>

          <div className='flex flex-col gap-4'>
            <Section title={language === 'en' ? 'Experiences' : 'Expérience Professionnelle'}>
              {data.experience.map((exp, index) => (
                <article key={index} className='glassPanel'>
                  <h4 className='text-md'>{exp.title} - {exp.company}</h4>
                  <p className='text-sm uppercase'>{exp.period}</p>
                  <div className="pl-4">
                    <div className='text-sm'>
                      {exp.responsibilities.map((resp, respIndex) => (
                        <p key={respIndex}>{resp}</p>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </Section>

            <Section title={language === 'en' ? 'Education' : 'Formation'}>
              <p className='text-sm text-justify'>{data.education}</p>
            </Section>

          </div>
        </div>
      </div>
    </div>
  );
};

export default CV;