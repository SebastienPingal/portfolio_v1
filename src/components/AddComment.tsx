"use client"

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

import { useState } from 'react'
import { createComment } from '@/app/actions'
import { useSession, signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

const AddComment = ({ postId }: { postId: string }) => {
  const session = useSession()
  const router = useRouter()

  const [comment, setComment] = useState('')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!session.data?.user?.email) {
      signIn('linkedin')
      return
    }

    createComment({
      content: comment,
      author: { connect: { email: session.data.user.email! } },
      post: { connect: { id: postId } }
    })
  
    setComment('')
    router.refresh()
  }

  return (
    <div className=' flex flex-col glassPanel p-2 rounded gap-2'>
      <h5>Leave a comment or ask me a question here :</h5>
      <form className='flex flex-col gap-2' onSubmit={handleSubmit}>
        <Textarea value={comment} onChange={(e) => setComment(e.target.value)} required />
        <Button type="submit">Submit</Button>
      </form>
    </div>
  )
}

export default AddComment