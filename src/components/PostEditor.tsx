'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createPost, updatePost } from '@/app/actions'

import { getPostTypes, getStacks, generateSlug } from '@/app/actions'
import MdEditor from '@/components/MdEditor'
import { PostType, Prisma, Stack, Post } from '@prisma/client'
import { useFormState } from 'react-dom'

import { X } from 'lucide-react'
import ComboBox from './ComboBox'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { useToast } from './ui/use-toast'

interface PostEditorProps {
  post?: Partial<Post>
  initialStacks?: Stack[]
  isNew?: boolean
}

const initialStatePostTypes = { postTypes: [] }

const PostEditor: React.FC<PostEditorProps> = ({
  post = { content: '', title: '', type: 'WORK'},
  initialStacks = [],
  isNew = false,
}: PostEditorProps) => {

  const { toast } = useToast()
  const router = useRouter()

  const [results, setPostTypes] = useFormState(getPostTypes, initialStatePostTypes)
  const [stacks, setStacks] = useFormState(getStacks, [])
  const [content, setContent] = useState(post.content)
  const [title, setTitle] = useState(post.title)
  const [type, setType] = useState(post.type)
  const [stackList, setStackList] = useState<Stack[]>(initialStacks || [])

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!title) return toast({ title: "Le titre est requis" })
    if (!content) return toast({ title: "Le contenu est requis" })
    if (!type) return toast({ title: "La catégorie est requise" })

    const data = {
      title: title!,
      content: content!,
      type: type!,
      stacks: {
        connect: stackList.map(stack => ({ id: stack.id })),
      }
    }
    if (isNew) {
      const slug = await generateSlug(title)
      handleCreatePost({ ...data, slug })
    }
    else handleUpdatePost(data)
  }
  
  const handleCreatePost = (data: Prisma.PostCreateInput) => {
    const createAndRedirect = async () => {
      const newPost = await createPost(data)
      toast({ title: `Article ${data.title} publié` })
      if (type === "WORK") router.push(`/work/${newPost.slug}`)
      else router.push(`/post/${newPost.slug}`)
    }

    createAndRedirect()
  }

  const handleUpdatePost = (data: Prisma.PostUpdateInput) => {
    if (!post.slug) return
    const updateAndRedirect = async () => {
      const updatedPost = await updatePost(post.slug!, data)
      if (type === "WORK") router.push(`/work/${updatedPost.slug}`)
      else router.push(`/post/${updatedPost.slug}`)
    }

    updateAndRedirect()
    toast({ title: `Article ${title} publié` })
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
      <MdEditor md={post.content || ''} className='w-full' onMdChange={setContent} />
      <Button variant='secondary' type='submit'>
        Publier
      </Button>
    </form >
  )
}

export default PostEditor
