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

export async function getWorkPosts() {
  const posts = await prisma.post.findMany({ where: { type: 'WORK' } })
  return { posts }
}

export async function deletePost(slug: string) {
  return await prisma.post.delete({ where: { slug } })
}

export async function getWorkPost(slug: string) {
  return await prisma.post.findUnique({ where: { slug } })
}
