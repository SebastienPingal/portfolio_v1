"use client"
import WebsiteLogo from '@/components/logo'



export default function Home() {
  return (
    <div className='flex flex-col items-center gap-5'>
      <WebsiteLogo className='w-40 h-40' />
      <p className='glassPanel'>
        Hey, I&apos;m Sébastien. I am designer, software tinkerer, music maker, and sometimes a teacher.
        I am curently working on this website, so it&apos;s a bit empty for now. But I&apos;m glad to finaly making somekind of hub for all my projects.
      </p>
    </div>
  )
}