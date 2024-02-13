'use client'

import { updatePost } from '@/app/actions'
import PostEditor from '@/components/PostEditor'
import { useToast } from '@/components/ui/use-toast'
import { PostType, Prisma, Stack } from '@prisma/client'
import { useRouter } from 'next/navigation'

type PostUpdatorProps = {
  slug: string
  title: string
  content: string
  type: PostType
  stacks: Stack[]
}

const PostUpdator = ({ slug, title, content, type, stacks }: PostUpdatorProps) => {
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = (data: Prisma.PostUpdateInput) => {
    const updateAndRedirect = async () => {
      const updatedPost = await updatePost(slug, data)
      if (type === "WORK") router.push(`/work/${updatedPost.slug}`)
      else router.push(`/post/${updatedPost.slug}`)
    }

    updateAndRedirect()
    toast({ title: `Article ${title} publié` })
  }

  return (
    <PostEditor initialStacks={stacks} initialContent={content} initialTitle={title} initialType={type} handleSubmit={handleSubmit} />
  )
}

export default PostUpdator
