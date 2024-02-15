'use server'
import prisma from '@/lib/db'
import { Prisma, PostType } from '@prisma/client'

export async function getPostTypes() {
  const result: { value: string }[] = await prisma.$queryRaw`SELECT unnest(enum_range(NULL::"PostType")) as value`
  const postTypes = result.map((row: { value: string }) => row.value)
  return { postTypes }
}

export async function generateSlug(title: string) {
  let slug = title.toLowerCase().replace(/ /g, '-')
  let originalSlug = slug
  if (await prisma.post.findUnique({ where: { slug } })) {
    let count = 1
    while (await prisma.post.findUnique({ where: { slug } })) {
      slug = `${originalSlug}-${count}`
      count++
    }
  }
  return slug
}

export async function createPost(data: Prisma.PostCreateInput) {
  return await prisma.post.create({ data })
}

export async function getPosts(type?: PostType) {
  const posts = type
    ? await prisma.post.findMany({ where: { type } })
    : await prisma.post.findMany()
  return posts
}

export async function deletePost(slug: string) {
  return await prisma.post.delete({ where: { slug } })
}

export async function updatePost(slug: string, data: Prisma.PostUpdateInput) {
  return await prisma.post.update({ where: { slug }, data })
}

export async function getWorkPost(slug: string) {
  return await prisma.post.findUnique({ where: { slug }, include: { stacks: true } })
}

export async function createStack(stackCreateInput: Prisma.StackCreateInput) {
  return await prisma.stack.create({ data: stackCreateInput })
}

export async function getStack(title: string) {
  return await prisma.stack.findFirst({ where: { title: { equals: title, mode: 'insensitive' } } })
}

export async function getStacks() {
  return await prisma.stack.findMany()
}

export async function deleteStack(id: string) {
  return await prisma.stack.delete({ where: { id } })
}

export async function updateStack(id: string, stackUpdateInput: Prisma.StackUpdateInput) {
  return await prisma.stack.update({ where: { id }, data: stackUpdateInput })
}
