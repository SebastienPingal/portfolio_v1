import { CommentExtended } from '@/app/types'

import Comment from './Comment'
import AddComment from './AddComment'

const CommentSection = ({ comments, postId }: { comments: CommentExtended[]; postId: string }) => {
  return (
    <div className='flex flex-col gap-3'>
      <p>Comments :</p>
      {comments.length !== 0 &&
        <div className='flex flex-col gap-2'>
          {comments.map((comment) => (
            <Comment key={comment.id} comment={comment} />
          ))}
        </div>
      }
      <AddComment postId={postId} />
    </div>
  )
}

export default CommentSection