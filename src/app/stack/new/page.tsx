'use client'

import StackEditor from "@/components/StackEditor"
import { Stack } from "@prisma/client"
import { createStack } from "@/app/actions"
import { useRouter } from "next/navigation"

const NewStack = () => {
  const router = useRouter()
  const handleSubmit = (stack: Stack) => {
    createStack({ title: stack.title, logo: stack.logo, description: stack.description, link: stack.link, icon: stack.icon, order: stack.order })
    router.push('/stack')
  }

  return (
    <div>
      <StackEditor handleSubmit={handleSubmit} />
    </div>
  )
}

export default NewStack