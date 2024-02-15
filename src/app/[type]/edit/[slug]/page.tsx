import { getStacks, getWorkPost } from '@/app/actions'
import PostEditor from '@/components/PostEditor'
import { notFound } from 'next/navigation'

interface pageProps {
  params: {
    slug: string;
  };
}

const EditPost = async ({ params }: pageProps) => {
  const slug = params.slug
  if (!slug) notFound()
  const workPost = await getWorkPost(slug)
  if (!workPost) notFound()
  const stacks = await getStacks()

  return (
    <PostEditor post={workPost} initialStacks={stacks} />
  )
}

export default EditPost