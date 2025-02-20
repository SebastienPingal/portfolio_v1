import { Suspense } from 'react'
import LandingPage from './LandingPage'
import { getStacks } from './actions'
import { auth } from './api/auth/[...nextauth]/auth'
import TalkingLogo from '@/components/TalkingLogo'



export default async function Home() {
  const stacks = await getStacks()
  const session = await auth()

  return (
    <div className='flex flex-col w-full items-center gap-5 overflow-y-visible'>
      <h1 className='text-5xl sm:text-8xl flex font-extrabold sm:text-left text-center bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/20 pb-2'>
        Sébastien Pingal
      </h1>

      <Suspense>
        <TalkingLogo className='w-full mb-10' tooltip />
      </Suspense>

      <Suspense fallback={<div className="w-full animate-pulse" />}>
        <LandingPage stacks={stacks} session={session} />
      </Suspense>
    </div>
  )
}