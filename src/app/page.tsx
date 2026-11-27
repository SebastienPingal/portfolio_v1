import { Suspense } from 'react'
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import LandingPage from './LandingPage'
import { getStacks, getProjects } from './actions'
import { auth } from './api/auth/[...nextauth]/auth'
import ContactSection from '@/components/ContactSection'

export default async function Home() {
  const t = await getTranslations('LandingPage')
  const stacks = await getStacks()
  const projects = await getProjects()

  let session = null
  try {
    session = await auth()
  } catch (error) {
    console.error('🔴 Failed to fetch auth session:', error)
  }

  return (
    <div className='flex flex-col w-full items-center gap-16 overflow-y-visible'>
      <section className='glassPanel rounded-2xl flex flex-col sm:flex-row items-center gap-6 sm:gap-10 w-full p-5 sm:p-8 mt-4 sm:mt-12'>
        <div className='relative w-40 h-40 sm:w-56 sm:h-56 flex-shrink-0 rounded-full overflow-hidden border-4 border-primary/50 shadow-lg'>
          <Image
            src='/img/seb8.jpg'
            alt='Sébastien Pingal'
            fill
            priority
            sizes='(min-width: 640px) 224px, 160px'
            className='object-cover'
          />
        </div>

        <div className='flex flex-col gap-4 items-center sm:items-start text-center sm:text-left'>
          <h1 className='text-5xl sm:text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/20 pb-2'>
            Sébastien Pingal
          </h1>
          <p className='text-xl sm:text-2xl font-bold'>{t('hero.tagline')}</p>
          <p className='text-base sm:text-lg opacity-80 max-w-xl'>{t('hero.availability')}</p>
          <ContactSection compact />
        </div>
      </section>

      {/* AI chat hidden while there are no API credits. To re-enable:
      <Suspense>
        <TalkingLogo className='w-full' hideHead text={t('chatIntro')} />
      </Suspense>
      */}

      <Suspense fallback={<div className="w-full animate-pulse" />}>
        <LandingPage stacks={stacks} session={session} projects={projects} />
      </Suspense>
    </div>
  )
}
