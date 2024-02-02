import { getWorkPost } from '@/app/actions';
import { notFound } from 'next/navigation';
import PostUpdator from './PostUpdator';

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

  const { title, content, type } = workPost

  return (
    <PostUpdator slug={slug} title={title} content={content} type={type} />
  )
}

export default EditPost