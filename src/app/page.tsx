import TalkingLogo from '@/components/TalkingLogo'
import LandingPage from './LandingPage'
import { getTranslations } from 'next-intl/server'
import { getStacks } from './actions'

export default async function Home() {
  const t = await getTranslations('HomePage')
  const stacks = await getStacks()
  return (
    <div className='flex flex-col w-full items-center gap-5 overflow-y-visible'>
      <h1 className='text-8xl flex font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/20 pb-2'>Sébastien Pingal</h1>
      <TalkingLogo className='w-full mb-10 ' tooltip />
      <LandingPage stacks={stacks} />
    </div>
  )
}