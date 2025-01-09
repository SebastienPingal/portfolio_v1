import { getStacks, getPost } from '@/app/actions'
import PostEditor from '@/components/PostEditor'
import { notFound } from 'next/navigation'

interface pageProps {
  params: Promise<{
    slug: string
  }>
}

const EditPost = async (props: pageProps) => {
  const params = await props.params
  const slug = params.slug
  if (!slug) notFound()
  const workPost = await getPost(slug)
  if (!workPost) notFound()

  return (
    <PostEditor post={workPost} initialStacks={workPost.stacks} />
  )
}

export default EditPost