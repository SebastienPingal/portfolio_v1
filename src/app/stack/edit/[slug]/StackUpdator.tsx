'use client'

import { updateStack } from "@/app/actions"
import StackEditor from "@/components/StackEditor"
import { useToast } from "@/components/ui/use-toast"
import { Stack } from "@prisma/client"
import { notFound, useRouter } from "next/navigation"

const StackUpdator = ({ stack }: { stack: Stack }) => {
  const router = useRouter()
  const { toast } = useToast()
  if (!stack) notFound()

  const handleUpdate = async (updatedStack: Partial<Stack>) => {
    try {
      await updateStack(stack.id, updatedStack)
      toast({ title: `✨ Stack updated: ${updatedStack.title}` })
      router.push('/stack')
    } catch (error) {
      toast({
        title: "❌ Error updating stack",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      })
      console.error('❌ Error:', error)
    }
  }

  return (
    <div>
      <StackEditor initialStack={stack} handleSubmit={handleUpdate} />
    </div>
  )
}

export default StackUpdator

