import { Comment, User } from '@prisma/client'

export interface CommentExtended extends Comment {
  author: User
}

