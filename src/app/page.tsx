"use client"
import TalkingLogo from '@/components/TalkingLogo'



export default function Home() {
  return (
    <div className='flex flex-col items-center gap-5'>
      <h1 className='text-8xl flex font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/20 pb-2'>Sébastien Pingal</h1>
      <TalkingLogo className='w-full mb-10 ' />
    </div>
  )
}