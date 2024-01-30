'use client'

import { useEffect, useState } from 'react'
import { useFormState } from 'react-dom'
import { PostType } from '@prisma/client'
import MdEditor from '@/components/MdEditor'
import { getPostTypes } from '@/app/actions'

import { Button } from './ui/button'
import { Input } from './ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'

interface PostEditorProps {
  initialContent?: string
  initialTitle?: string
  initialType?: PostType
  handleSubmit: (title: string, content: string, type: PostType) => void
}

const initialStatePostTypes = { postTypes: [] }

const PostEditor: React.FC<PostEditorProps> = ({ initialContent = '### Hello World', initialTitle = '', initialType = '' as PostType, handleSubmit }) => {
  const [results, setPostTypes] = useFormState(getPostTypes, initialStatePostTypes)
  const [content, setContent] = useState(initialContent)
  const [title, setTitle] = useState(initialTitle)
  const [type, setType] = useState(initialType)

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    handleSubmit(title, content, type)
  }

  useEffect(() => {
    setPostTypes()
  }, [])

  return (
    <form className='flex flex-col gap-4' onSubmit={onSubmit}>
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Titre de l'article"
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
}

export default PostEditor
