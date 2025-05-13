import { useTranslations } from 'next-intl'
import { StackExtended } from '@/types/stack'
import ContactSection from '@/components/ContactSection'
import MyStacksSession from './my-stacks-session'
import ProjectSection from '@/components/ProjectSection'
import { Project } from '@prisma/client'

export default function LandingPage({ stacks, session, projects }: { stacks: StackExtended[], session: any, projects: Project[] }) {
  const t = useTranslations('LandingPage')

  return (
    <div className='flex flex-col gap-16 sm:gap-32 w-full mt-16'>
      <div className='flex flex-col gap-2'>
        <MyStacksSession stacks={stacks} session={session} />
        <ContactSection />
      </div>
      <ProjectSection projects={projects} />
      {/* 
      <h2 className='text-7xl font-black text-center'>{t('projects')}</h2>

      <div className='flex flex-col gap-4 w-full'>
        <div className='flex flex-col gap-2'>
          <h2 className='text-4xl sm:text-6xl font-black'>{t('companies.moneoDomus')}</h2>
          <p>{t('roles.fullstack')}</p>
          <div>
            <ImageScrollDisplay images={moneoDomusImages} height={600} mobileHeight={200} />
          </div>
        </div>
      </div>

      <div className='flex flex-col gap-4 w-full'>
        <div className='flex flex-col gap-2'>
          <h2 className='text-4xl sm:text-6xl font-black'>{t('companies.aestimaImmo')}</h2>
          <p>{t('roles.fullstack')}</p>
          <div>
            <ImageScrollDisplay images={estimaImmoImages} height={600} mobileHeight={200} />
          </div>
        </div>
      </div> */}
    </div>
  )
}