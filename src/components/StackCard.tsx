import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { MoveUpRight, PencilRuler } from 'lucide-react'
import Link from 'next/link'
import PopoverDeleteStack from './PopoverDeleteStack'
import { auth } from '@/app/api/auth/[...nextauth]/auth'
import { Stack } from '@prisma/client'

const StackCard = async ({ stack, className }: { stack: Stack; className?: string }) => {
  const session = await auth()

  return (
    <Card id={stack.title} className={`w-full ${className}`}>
      <CardHeader>
        <CardTitle className='flex gap-3 items-center'>
          <div className='bg-white/90 w-16 h-16 rounded relative border-2 border-primary/60 flex-shrink-0'>
            { stack.logo ?
              <Image src={stack.logo} alt={stack.title} fill={true} className='object-contain p-1' />
              : <div className='flex items-center justify-center w-full h-full text-4xl text-primary'>{stack.title[0]}</div>
            }
          </div>
          <p className='text-2xl truncate'>{stack.title}</p>
        </CardTitle>
      </CardHeader>
      <CardContent className='relative flex flex-col gap-2'>
        <CardDescription>{stack.description}</CardDescription>
        <a href={stack.link} target="_blank" rel="noreferrer">
          <Button className='flex gap-2'>
            Learn More <MoveUpRight className="w-4 h-4" />
          </Button>
        </a>
      </CardContent>
      {session?.user && session.user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL && (
        <div className='absolute right-2 top-2 flex gap-1'>
          <Link href={`/stack/edit/${stack.title.replace(/\s+/g, '-').toLowerCase()}`}>
            <Button size='sm' variant="outline">
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