import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Image from 'next/image'

import { Button } from '@/components/ui/button'
import { MoveUpRight, PencilRuler } from 'lucide-react'

import { StackExtended } from '@/types/stack'

import Link from 'next/link'

import PopoverDeleteStack from './PopoverDeleteStack'
import UsingItSection from './UsingItSection'
import { getTranslations } from 'next-intl/server'

const StackCard = async ({ stack, className, tooltiped = false, session }: { stack: StackExtended; className?: string; tooltiped?: boolean, session: any }) => {
  const t = await getTranslations('StackCard')

  return (
    <Card id={stack.title} className={`max-w-md ${className}`}>
      <CardHeader>
        <CardTitle className='flex gap-3 items-center'>
          <div className='bg-white/90 w-16 h-16 rounded relative flex-shrink-0'>
            {stack.logo ?
              <Image src={stack.logo} alt={stack.title} fill={true} className='object-contain p-1 bg-background rounded-sm' />
              : <div className='flex items-center justify-center w-full h-full text-4xl text-primary bg-background rounded-sm'>{stack.title[0]}</div>
            }
          </div>
          <p className='text-2xl truncate'>{stack.title}</p>
        </CardTitle>
      </CardHeader>
      <CardContent className='relative flex flex-col gap-2'>
        <CardDescription className={`${stack.description.length > 100 ? 'text-justify' : ''}`}>{stack.description}</CardDescription>
        <a href={stack.link} target="_blank" rel="noreferrer">
          <Button className='flex gap-2'>
            {t('learnMore')} <MoveUpRight className="w-4 h-4" />
          </Button>
        </a>
        <UsingItSection
          stack={stack}
          userMail={session?.user?.email ?? ''}
          usingIt={stack.users.some(user => user.email === session?.user?.email)}
          tooltiped={tooltiped}
          session={session}
        />
      </CardContent>
      {session?.user && (
        <div className='absolute right-2 top-2 flex gap-1'>
          <Link href={`/stack/edit/${stack.title.replace(/\s+/g, '-').toLowerCase()}`}>
            <Button size='sm' variant="outline" aria-label={t('edit')}>
              <PencilRuler className="h-4 w-4" />
            </Button>
          </Link>
          <PopoverDeleteStack stack={stack} />
        </div>
      )}
    </Card>
  )
}

export default StackCard