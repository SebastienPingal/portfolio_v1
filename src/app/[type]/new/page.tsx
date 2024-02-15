"use client"
import { createPost } from '@/app/actions'
import { PostType, Prisma } from '@prisma/client'
import { useSession } from 'next-auth/react'
import { redirect, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

import PostEditor from '@/components/PostEditor'
import { useToast } from '@/components/ui/use-toast'

const NewPost = () => {
  const router = useRouter()
  const session = useSession()
  const [type, setType] = useState('' as PostType)

  const { toast } = useToast()

  const searchParams = useSearchParams()
  const typeQuery = searchParams.get('type')
  if (typeQuery && !type && Object.values(PostType).includes(typeQuery as PostType)) setType(typeQuery as PostType)

  useEffect(() => {
    if (session.status === "loading") return // Wait until the session is loaded

    if (session.status === "unauthenticated" || session.data?.user?.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
      redirect('/')
    }
  }, [session.status, session.data])

  const handleSubmit = (data: Prisma.PostCreateInput) => {
    const createAndRedirect = async () => {
      const newPost = await createPost(data)
      toast({ title: `Article ${data.title} publié` })
      if (type === "WORK") router.push(`/work/${newPost.slug}`)
      else router.push(`/post/${newPost.slug}`)
    }

    createAndRedirect()
  }

  return (
    <PostEditor isNew={true} />
  )
}

export default NewPost