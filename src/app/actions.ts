'use server'
import prisma from '@/lib/db'
import { Prisma, PostType } from '@prisma/client'

export async function getPostTypes() {
  const result: { value: string }[] = await prisma.$queryRaw`SELECT unnest(enum_range(NULL::"PostType")) as value`
  const postTypes = result.map((row: { value: string }) => row.value)
  return { postTypes }
}

export async function createPost(data: { title: string, content: string, type: PostType }) {
  let slug = data.title.toLowerCase().replace(/ /g, '-')
  let originalSlug = slug
  if (await prisma.post.findUnique({ where: { slug } })) {
    let count = 1
    while (await prisma.post.findUnique({ where: { slug } })) {
      slug = `${originalSlug}-${count}`
      count++
    }
  }
  return await prisma.post.create({ data: { ...data, slug } })
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

export async function updatePost(slug: string, data: { title: string, content: string, type: PostType }) {
  return await prisma.post.update({ where: { slug }, data })
}

export async function getWorkPost(slug: string) {
  return await prisma.post.findUnique({ where: { slug } })
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
