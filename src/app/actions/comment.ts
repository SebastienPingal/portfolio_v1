'use server'
import prisma from '@/lib/db'
import { Prisma } from '@prisma/client'

export async function createComment(data: Prisma.CommentCreateInput) {
  return await prisma.comment.create({ data })
} 