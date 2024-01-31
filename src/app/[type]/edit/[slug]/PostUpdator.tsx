'use client'

import { updatePost } from '@/app/actions'
import { useToast } from '@/components/ui/use-toast'
import { useRouter } from 'next/navigation'
import { PostType } from '@prisma/client'
import PostEditor from '@/components/PostEditor'

const PostUpdator = ({ slug, title, content, type }: { slug: string, title: string, content: string, type: PostType }) => {
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = (title: string, content: string, type: PostType) => {
    const updateAndRedirect = async () => {
      const updatedPost = await updatePost(slug, { title, content, type })
      if (type === "WORK") router.push(`/work/${updatedPost.slug}`)
      else router.push(`/post/${updatedPost.slug}`)
    }

    updateAndRedirect()
    toast({ title: `Article ${title} publié` })
  }

  return (
    <PostEditor initialContent={content} initialTitle={title} initialType={type} handleSubmit={handleSubmit} />
  )
}

export default PostUpdator
