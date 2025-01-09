import { getPost } from '@/app/actions'
import StackBadge from '@/components/StackBadge'
import { notFound } from 'next/navigation'


import CommentSection from '@/components/CommentSection'
import MarkdownInterpreter from '@/components/MarkdownInterpreter'

interface pageProps {
  params: Promise<{
    slug: string;
  }>;
}

const WorkPost = async (props: pageProps) => {
  const params = await props.params;
  const slug = params.slug
  if (!slug) notFound()
  const post = await getPost(slug)
  if (!post) notFound()
  const { title, content } = post

  return (
    <div className='flex flex-col gap-4'>
      <div className='glassPanel flex flex-col gap-5'>
        <h1 className='font-black'>{title}</h1>
        <div className={`flex gap-3 flex-wrap ${post.stacks.length > 5 ? 'justify-between' : ''}`}>
          {post.stacks.map((stack) => (
            <StackBadge key={stack.id} stack={stack} />
          ))}
        </div>
        <MarkdownInterpreter content={content} />
      </div>
      <CommentSection comments={post.comments} postId={post.id} />
    </div>
  )
}

export default WorkPost