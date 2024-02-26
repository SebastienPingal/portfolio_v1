"use client"
import { PostType } from '@prisma/client'
import { useSession } from 'next-auth/react'
import { redirect, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

import PostEditor from '@/components/PostEditor'

const NewPost = () => {
  const session = useSession()
  const [type, setType] = useState('' as PostType)


  const searchParams = useSearchParams()
  const typeQuery = searchParams.get('type')
  if (typeQuery && !type && Object.values(PostType).includes(typeQuery as PostType)) setType(typeQuery as PostType)

  useEffect(() => {
    if (session.status === "loading") return // Wait until the session is loaded

    if (session.status === "unauthenticated" || session.data?.user?.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
      redirect('/')
    }
  }, [session.status, session.data])

  return (
    <PostEditor isNew={true} />
  )
}

export default NewPost