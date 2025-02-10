'use client'

import StackEditor from "@/components/StackEditor"
import { Stack } from "@prisma/client"
import { createStack } from "@/app/actions"
import { useRouter } from "next/navigation"

const NewStack = () => {
  const router = useRouter()
  
  const handleSubmit = (stack: Partial<Stack>) => {
    // Extract only the fields we need for creation
    const newStack = {
      title: stack.title ?? '',
      logo: stack.logo ?? '',
      description: stack.description ?? '',
      link: stack.link ?? '',
      icon: stack.icon ?? null,
      order: stack.order ?? null
    }
    
    createStack(newStack)
    router.push('/stack')
  }

  return (
    <div>
      <StackEditor handleSubmit={handleSubmit} />
    </div>
  )
}

export default NewStack