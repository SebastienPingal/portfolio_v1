import ImageScrollDisplay from '@/components/image-scroll-display'
import { useTranslations } from 'next-intl'
import { StackExtended } from '@/types/stack'
import ContactSection from '@/components/ContactSection'
import MyStacksSession from './my-stacks-session'

export default function LandingPage({ stacks, session }: { stacks: StackExtended[], session: any }) {
  const t = useTranslations('LandingPage')

  const moneoDomusImages = [
    'https://uoeohmz1cojcdmtr.public.blob.vercel-storage.com/2025-02-11-181312_hyprshot-lv098JIqd5UlhQMndXGGzuZm0ZUar4.png',
    'https://uoeohmz1cojcdmtr.public.blob.vercel-storage.com/2025-02-11-181232_hyprshot-7RuXxRPGWI8hIdDGYRT4YOzDxi8PLs.png',
    'https://uoeohmz1cojcdmtr.public.blob.vercel-storage.com/2025-02-11-181222_hyprshot-T9fFidjoXUOdXCksUtR9lwFdW6y5ZV.png',
    'https://uoeohmz1cojcdmtr.public.blob.vercel-storage.com/2025-02-11-181957_hyprshot-O3vPith7QYZ9J8HjjIQSbyl1BbiiGW.png',
  ]
  const estimaImmoImages = [
    'https://uoeohmz1cojcdmtr.public.blob.vercel-storage.com/aestima5-XYkAYEUQAXdpqSpQraFT5rkqlfAm0w.jpeg',
    'https://uoeohmz1cojcdmtr.public.blob.vercel-storage.com/aestima-znogA301RorJCc7BV74ebPQse8pR6W.webp',
    'https://uoeohmz1cojcdmtr.public.blob.vercel-storage.com/aestima2-xjufnK8bQEt04WTjGO0zDgUjWc2yTL.webp',
    'https://uoeohmz1cojcdmtr.public.blob.vercel-storage.com/aestima3-DqjTznll5PshneKWlztic1Wm6yfbai.jpeg',
    'https://uoeohmz1cojcdmtr.public.blob.vercel-storage.com/aestima4-zyfkQOWdKtHDNONA5pTOhIHSqbiLMD.jpeg',
  ]

  return (
    <div className='flex flex-col gap-16 sm:gap-32 w-full mt-16'>
      <div className='flex flex-col gap-2'>
        <MyStacksSession stacks={stacks} session={session} />
        <ContactSection />
      </div>

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
      </div>

      <ContactSection />
    </div>
  )
}