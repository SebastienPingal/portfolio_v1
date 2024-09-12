'use client'

import { Progress } from '@/components/ui/progress'
import React from 'react';
import { CVProps } from '../../types/CV';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';

const CV: React.FC<CVProps> = ({ data }) => {

  const Section = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <section className="flex flex-col gap-2 glassPanel">
      <h3>{title}</h3>
      {children}
    </section>
  );

  const { theme } = useTheme()
  const me = theme === 'light' ? '/img/me_black.svg' : '/img/me_white.svg'

  const handlePrint = () => {
    window.print()
  }

  return (
    <>
      <Button onClick={handlePrint}>
        Convert to pdf
      </Button>
      <div className="glassPanel flex flex-col gap-4">

        <header className='flex gap-4 items-center ml-8'>
          <Image src={me} alt="Me" width={50} height={50} />
          <div>
            <h1>{data.name}</h1>
            <p>{data.title}</p>
          </div>
        </header>

        <Section title="À Propos">
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

            <Section title="Langues">
              <div className='text-sm text-justify'>
                {data.languages.map((lang, index) => (
                  <p key={index}>{lang.name}: {lang.level}</p>
                ))}
              </div>
            </Section>

            <Section title="Technologies">
              <div className="flex flex-col gap-1">
                {data.skills.stack.map((skill, index) => (
                  <div key={index} className='flex flex-col gap-1'>
                    <span className="whitespace-nowrap text-sm">{skill.name}</span>
                    <Progress value={skill.rating * 20} className="w-full h-1" />
                  </div>
                ))}
              </div>
            </Section>

            <Section title="Autres Compétences">
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
            <Section title="Expérience Professionnelle">
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

            <Section title="Formation">
              <p className='text-sm text-justify'>{data.formation}</p>
            </Section>

          </div>
        </div>
      </div>
    </>
  );
};

export default CV;