import { getStack } from '@/app/actions'
import { notFound } from 'next/navigation'
import StackUpdator from './StackUpdator'

interface pageProps {
  params: Promise<{
    slug: string;
  }>;
}

const EditStack = async (props: pageProps) => {
  const params = await props.params;
  const slug = params.slug
  const stack = await getStack(slug)
  if (!stack) notFound()


  return (
    <StackUpdator stack={stack} />
  )
}

export default EditStack

