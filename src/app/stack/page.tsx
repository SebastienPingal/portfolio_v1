import { auth } from '@/app/api/auth/[...nextauth]/auth'
import StackCard from "@/components/StackCard"
import { Button } from "@/components/ui/button"
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { getStacks } from '../actions'


const StackPage = async () => {
  const session = await auth()
  const techStack = await getStacks()

  return (
    <div className="p-5 w-full">
      <h1 className="mb-5">My Tech Stack</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">

        {techStack.map((stack, index) => {
          return (<StackCard key={index} stack={stack} />)
        })}

        {session?.user && session.user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL && (
          <Link href="/stack/new" className='h-1/2 w-1/2 flex flex-col gap-2 place-self-center'>
            <Button className='h-full w-full flex flex-col gap-2 place-self-center'>
              <h6 className='text-center font-extrabold'> Add a tech</h6>
              <Plus className="h-20 w-20" />
            </Button>
          </Link>
        )}
      </div>
    </div>
  )
}

export default StackPage