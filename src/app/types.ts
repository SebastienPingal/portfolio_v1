import { Stack, User, Comment } from '@prisma/client'

export interface StackExtended extends Stack {
  users: User[]
}

export interface CommentExtended extends Comment {
  author: User
}

