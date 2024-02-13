'use client'

import { useEffect, useState } from 'react'

import { getPostTypes, getStacks } from '@/app/actions'
import MdEditor from '@/components/MdEditor'
import { PostType, Prisma, Stack } from '@prisma/client'
import { useFormState } from 'react-dom'

import { X } from 'lucide-react'
import ComboBox from './ComboBox'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'

interface PostEditorProps {
  initialContent?: string
  initialTitle?: string
  initialType?: PostType
  initialStacks?: Stack[]
  handleSubmit: (data: Prisma.PostCreateInput | Prisma.PostUpdateInput) => void
}

const initialStatePostTypes = { postTypes: [] }

const PostEditor: React.FC<PostEditorProps> = ({
  initialContent = '### Hello World',
  initialTitle = '',
  initialType = '' as PostType,
  initialStacks = [],
  handleSubmit
}) => {
  const [results, setPostTypes] = useFormState(getPostTypes, initialStatePostTypes)
  const [stacks, setStacks] = useFormState(getStacks, [])
  const [content, setContent] = useState(initialContent)
  const [title, setTitle] = useState(initialTitle)
  const [type, setType] = useState(initialType)
  const [stackList, setStackList] = useState<Stack[]>(initialStacks)

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    handleSubmit({
      title,
      content,
      type,
      stacks: {
        connect: stackList.map(stack => ({ id: stack.id })),
      }
    })
  }

  useEffect(() => {
    setPostTypes()
    setStacks()
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
      <div className='flex gap-2 flex-wrap'>
        {stackList.map((stack) => (
          <Badge key={stack.title}
            onClick={() => setStackList((prev) => prev.filter((s) => s !== stack))}
            className='relative cursor-pointer group hover:opacity-100 opacity-100 transition-opacity duration-200 flex justify-center items-center'
          >
            {stack.title}
            <X className='absolute h-4 w-4 group-hover:opacity-100 opacity-0 text-destructive' strokeWidth={4} />
          </Badge>
        ))}
      </div>
      <ComboBox stacks={stacks} selectedStacks={stackList} setSelectedStacks={setStackList} />
      <Select required defaultValue={type} onValueChange={(value) => setType(value as PostType)}>
        <SelectTrigger>
          < SelectValue placeholder="Catégorie" />
        </SelectTrigger>
        <SelectContent>
          {results.postTypes.map((postType: any) => (
            <SelectItem key={postType} value={postType}>{postType}</SelectItem>
          ))}
        </SelectContent>
      </Select >
      <MdEditor md={content} className='w-full' onMdChange={setContent} />
      <Button variant='secondary' type='submit'>
        Publier
      </Button>
    </form >
  )
}

export default PostEditor
