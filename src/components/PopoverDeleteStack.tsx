'use client'

import { Popover, PopoverTrigger, PopoverContent, PopoverClose } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Trash } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

import { useRouter } from 'next/navigation'

import { deleteStack } from '@/app/actions'
import { Stack } from '@prisma/client'

const PopoverDeleteStack = ({stack}: {stack: Stack}) => {
  const { toast } = useToast()
  const router = useRouter()

  const handleDelete = async (stack: Stack) => {
    await deleteStack(stack.id)
    toast({ title: `Stack deleted: ${stack.title}` })
    router.refresh()
  }

  return (
    <Popover>
      <PopoverTrigger>
        <Button variant="destructive" size="sm">
          <Trash className="w-4 h-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex flex-col gap-2">
        <p>Are you sure you want to delete this tech ?</p>
        <PopoverClose className="flex gap-9 justify-center">
          <Button onClick={() => handleDelete(stack)} variant="destructive">Yes</Button>
          <Button variant="outline">No</Button>
        </PopoverClose>
      </PopoverContent>
    </Popover>
  )
}

export default PopoverDeleteStack