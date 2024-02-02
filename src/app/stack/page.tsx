import { auth } from '@/app/api/auth/[...nextauth]/auth'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MoveUpRight, PencilRuler, Plus } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { getStacks } from '../actions'
import PopoverDeleteStack from './PopoverDeleteStack'


const StackPage = async () => {
  const session = await auth()
  const techStack = await getStacks()

  return (
    <div className="p-5 w-full">
      <h1 className="mb-5">My Tech Stack</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">

        {techStack.map((tech, index) => {
          return (
            <Card id={tech.title} key={index} className='w-full'>
              <CardHeader>
                <CardTitle className='flex gap-3 items-center'>
                  <div className='bg-white/90 w-16 h-16 rounded relative border-2 border-primary/60'>
                    <Image src={tech.logo} alt={tech.title} fill={true} className='object-contain p-1' />
                  </div>
                  <p className='text-2xl'>{tech.title}</p>
                </CardTitle>
              </CardHeader>
              <CardContent className='relative flex flex-col gap-2'>
                <CardDescription>{tech.description}</CardDescription>
                <a href={tech.link} target="_blank" rel="noreferrer">
                  <Button className='flex gap-2'>
                    Learn More <MoveUpRight className="w-4 h-4" />
                  </Button>
                </a>
              </CardContent>
              {session?.user && session.user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL && (
                <div className='absolute right-2 top-2 flex gap-1'>
                  <Link href={`/stack/edit/${tech.title.replace(/\s+/g, '-').toLowerCase()}`}>
                    <Button size='sm' variant="outline">
                      <PencilRuler className="h-4 w-4" />
                    </Button>
                  </Link>
                  <PopoverDeleteStack stack={tech} />
                </div>
              )}
            </Card>
          )
        })}

        {session?.user && session.user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL && (
          <Link href="/stack/new">
            <Button className='h-full w-full flex flex-col gap-2 items-center'>
              <h3> Add a tech </h3>
              <Plus className="h-20 w-20" />
            </Button>
          </Link>
        )}
      </div>
    </div>
  )
}

export default StackPage