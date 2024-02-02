'use client'

import { updateStack } from "@/app/actions";
import StackEditor from "@/components/StackEditor";
import { useToast } from "@/components/ui/use-toast";
import { Stack } from "@prisma/client";
import { notFound, useRouter } from "next/navigation";


const StackUpdator = ({ stack }: { stack: Stack }) => {
  const router = useRouter()
  const { toast } = useToast()
  if (!stack) notFound()

  const handleUpdate = async (stack: Stack) => {
    await updateStack(stack.id, stack)
    toast({ title: `Stack updated: ${stack.title}` })
    router.push('/stack')
  }

  return (
    <div>
      <StackEditor initialStack={stack} handleSubmit={handleUpdate} />
    </div>
  )
}

export default StackUpdator

