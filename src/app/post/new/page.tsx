"use client"
import MdEditor from '@/components/MdEditor'
import { useEffect, useState } from 'react'
import { getPostTypes, createPost } from '@/app/actions';
import { useFormState } from 'react-dom';
import { PostType } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { redirect, useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

const initialStatePostTypes = { postTypes: [] }

const NewPost = () => {
  const router = useRouter()
  const session = useSession()
  const [results, setPostTypes] = useFormState(getPostTypes, initialStatePostTypes)
  const [content, setContent] = useState('### Hello World')
  const [title, setTitle] = useState('')
  const [type, setType] = useState('' as PostType)

  const searchParams = useSearchParams()
  const typeQuery = searchParams.get('type')
  if (typeQuery && !type && Object.values(PostType).includes(typeQuery as PostType)) setType(typeQuery as PostType)

  useEffect(() => {
    if (session.status === "loading") return // Wait until the session is loaded

    if (session.status === "unauthenticated" || session.data?.user?.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
      redirect('/')
    }
  }, [session.status, session.data])

  useEffect(() => {
    setPostTypes()
  }, [])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    createPost({ title, content, type })
    router.push('/')
  }

  return (
    <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder='Entre ici le titre de votre article'
        className='mb-4'
        required
      />
      <Select required defaultValue={type} onValueChange={(value) => setType(value as PostType)}>
        <SelectTrigger>
          <SelectValue placeholder="Catégorie" />
        </SelectTrigger>
        <SelectContent>
          {results.postTypes.map((postType: any) => (
            <SelectItem key={postType} value={postType}>{postType}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <MdEditor md={content} className='w-full' onMdChange={setContent} />
      <Button variant='secondary' type='submit'>
        Publier
      </Button>
    </form>
  )
};

export default NewPost