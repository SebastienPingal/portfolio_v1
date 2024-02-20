import { getPost } from '@/app/actions'
import StackBadge from '@/components/StackBadge'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import CommentSection from '@/components/CommentSection'

interface pageProps {
  params: {
    slug: string;
  };
}

const WorkPost = async ({ params }: pageProps) => {
  const slug = params.slug
  if (!slug) notFound()
  const post = await getPost(slug)
  if (!post) notFound()
  const { title, content } = post

  return (
    <div className='flex flex-col gap-4'>
      <div className='glassPanel flex flex-col gap-5'>
        <h1 className='font-black'>{title}</h1>
        <div className='flex gap-3'>
          {post.stacks.map((stack) => (
            <StackBadge key={stack.id} stack={stack} />
          ))}
        </div>
        <div>
          <ReactMarkdown className='flex flex-col gap-3'>{content}</ReactMarkdown>
        </div>
      </div>
      <CommentSection comments={post.comments} postId={post.id} />
    </div>
  )
}

export default WorkPost