import { CommentExtended } from "@/app/types"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"

const Comment = ({ comment }: { comment: CommentExtended }) => {
  return (
    <div className="flex gap-3 items-center p-1 glassPanel w-fit px-5">
      <Avatar key={comment.author.id}>
        <AvatarImage src={comment.author.image || ''} />
        <AvatarFallback>{comment.author.firstname?.[0]}{comment.author.lastname?.[0]}</AvatarFallback>
      </Avatar>
      <div>
        <p>{comment.content}</p>
      </div>
    </div>
  )
}

export default Comment