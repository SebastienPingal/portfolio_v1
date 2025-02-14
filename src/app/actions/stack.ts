'use server'
import prisma from '@/lib/db'
import { Prisma } from '@prisma/client'
import { unstable_cache, revalidateTag } from 'next/cache'

export const getStacks = unstable_cache(
  async () => {
    const start = performance.now()
    console.log('🔍 Starting stacks fetch')
    const result = await prisma.stack.findMany({ include: { posts: true, users: true } })
    console.log('⏱️ Stacks fetch took:', performance.now() - start, 'ms')
    return result
  },
  ['stacks'],
  {
    revalidate: false,
    tags: ['stacks']
  }
)

export async function createStack(data: Prisma.StackCreateInput) {
  console.log('✨ Creating new stack')
  const newStack = await prisma.stack.create({ data })
  revalidateTag('stacks')
  return newStack
}

export async function getStack(title: string) {
  return await prisma.stack.findFirst({
    where: {
      title: { equals: title, mode: 'insensitive' }
    },
    include: { posts: true, users: true }
  })
}

export async function updateStack(id: string, data: Prisma.StackUpdateInput) {
  console.log('🔄 Updating stack')
  const updatedStack = await prisma.stack.update({ where: { id }, data })
  revalidateTag('stacks')
  return updatedStack
}

export async function deleteStack(id: string) {
  console.log('🗑️ Deleting stack')
  const deletedStack = await prisma.stack.delete({ where: { id } })
  revalidateTag('stacks')
  return deletedStack
} 