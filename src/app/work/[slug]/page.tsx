import ReactMarkdown from 'react-markdown'
import { getWorkPost } from '@/app/actions'
import { notFound } from 'next/navigation'

interface pageProps {
  params: {
    slug: string;
  };
}

const WorkPost = async ({ params }: pageProps) => {
  const slug = params.slug
  if (!params.slug) notFound()
  const workPost = await getWorkPost(params.slug)
  if (!workPost) notFound()
  const { title, content } = workPost

  return (
    <div className='glassPanel flex flex-col gap-5'>
      <h1 className='font-black'>{title}</h1>
      <div>
        <ReactMarkdown className='flex flex-col gap-3'>{content}</ReactMarkdown>
      </div>
    </div>
  )
}

export default WorkPost