import React from 'react';
import { CVProps } from '../../types/CV'
import { Progress } from '@/components/ui/progress'

const CV: React.FC<CVProps> = ({ data }) => {

  const Section = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <section className="flex flex-col gap-2 glassPanel">
      <h2>{title}</h2>
      {children}
    </section>
  );

  return (
    <div className="glassPanel flex flex-col gap-4">
      <header className='flex flex-col ml-8'>
        <h1>{data.name}</h1>
        <p>{data.title}</p>
      </header>

      <Section title="À Propos">
        <p>{data.about}</p>
      </Section>

      <div className='flex gap-4'>
        <div className='flex flex-col gap-4'>
          <Section title="Contact">
            <p>
              GitHub: <a href={`https://${data.contact.github}`}>{data.contact.github}</a><br />
              Email: {data.contact.email}<br />
              Téléphone: {data.contact.phone}<br />
              Localisation: {data.contact.location}
            </p>
          </Section>

          <Section title="Langues">
            <ul>
              {data.languages.map((lang, index) => (
                <li key={index}>{lang.name}: {lang.level}</li>
              ))}
            </ul>
          </Section>
        </div>

        <div className='flex flex-col gap-4'>
          <Section title="Expérience Professionnelle">
            {data.experience.map((exp, index) => (
              <article key={index} className='glassPanel'>
                <h3>{exp.title} - {exp.company}</h3>
                <div className="pl-4">
                  <p className='text-sm uppercase'>{exp.period}</p>
                  <ul className='text-md'>
                    {exp.responsibilities.map((resp, respIndex) => (
                      <li key={respIndex}>{resp}</li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </Section>

          <Section title="Technologies">
            <div className="grid grid-cols-3 gap-x-2 gap-y-1 items-center list-none">
              {data.skills.stack.map((skill, index) => (
                <div key={index}>
                  <span className="whitespace-nowrap">{skill.name}</span>
                  <Progress value={skill.rating * 20} className="w-full h-4" />
                </div>
              ))}
            </div>
          </Section>

          <Section title="Autres Compétences">
            <div className="grid grid-cols-3 gap-x-2 gap-y-1 items-center list-none">
              {data.skills.other.map((skill, index) => (
                <div key={index}>
                  <span className="whitespace-nowrap">{skill.name}</span>
                  <Progress value={skill.rating * 20} className="w-full h-4" />
                </div>
              ))}
            </div>
          </Section>

          <Section title="Formation">
            <p>{data.formation}</p>
          </Section>

        </div>
      </div>
    </div>
  );
};

export default CV;