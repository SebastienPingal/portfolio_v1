'use server'
import prisma from '@/lib/db'
import { Prisma, PostType } from '@prisma/client'
import { revalidatePath } from 'next/cache'

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
  const existingPost = await prisma.post.findUnique({
    where: { slug },
  })

  if (!existingPost) {
    throw new Error('Post not found')
  }

  await prisma.$transaction(async (tx) => {
    await tx.comment.deleteMany({
      where: { postId: existingPost.id },
    })
    await tx.post.delete({
      where: { slug },
    })
  })
  await revalidatePath('/')
}

export async function updatePost(slug: string, data: Prisma.PostUpdateInput) {
  return await prisma.post.update({ where: { slug }, data })
}

export async function getPost(slug: string) {
  return await prisma.post.findUnique({
    where: { slug },
    include: {
      stacks: { include: { users: true } },
      comments: { include: { author: true } }
    }
  })
} 