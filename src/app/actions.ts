'use server'
import prisma from '@/lib/db'
import { PostType } from '@prisma/client'

export async function getStacks() {
  return await prisma.stack.findMany()
}

export async function getPostTypes() {
  const result: { value: string }[] = await prisma.$queryRaw`SELECT unnest(enum_range(NULL::"PostType")) as value`
  const postTypes = result.map((row: { value: string }) => row.value)
  return { postTypes }
}

export async function createPost(data: { title: string, content: string, type: PostType }) {
  return await prisma.post.create({ data })
}

export async function getWorkPosts() {
  const posts = await prisma.post.findMany({ where: { type: 'WORK' } })
  return { posts }
}

