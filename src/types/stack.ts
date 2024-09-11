import { Stack, User } from '@prisma/client'

export interface StackExtended extends Stack {
  users: User[]
}