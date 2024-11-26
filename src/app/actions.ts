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
    // Handle the case where the post does not exist.
    // For example, you might want to throw an error or return a specific message.
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

/* EXTERNAL LINKS */

export async function createExternalLink(externalLinkCreateInput: Prisma.ExternalLinkCreateInput) {
  return await prisma.externalLink.create({ data: externalLinkCreateInput })
}

export async function getExternalLinks() {
  return await prisma.externalLink.findMany()
}

export async function deleteExternalLink(id: string) {
  return await prisma.externalLink.delete({ where: { id } })
}

export async function updateExternalLink(id: string, externalLinkUpdateInput: Prisma.ExternalLinkUpdateInput) {
  return await prisma.externalLink.update({ where: { id }, data: externalLinkUpdateInput })
}

/* STACKS */

export async function createStack(stackCreateInput: Prisma.StackCreateInput) {
  return await prisma.stack.create({ data: stackCreateInput })
}

export async function getStack(title: string) {
  return await prisma.stack.findFirst({
    where: {
      title: { equals: title, mode: 'insensitive' }
    },
    include: { posts: true, users: true }
  })
}

export async function getStacks() {
  return await prisma.stack.findMany({ include: { posts: true, users: true } })
}

export async function deleteStack(id: string) {
  return await prisma.stack.delete({ where: { id } })
}

export async function updateStack(id: string, stackUpdateInput: Prisma.StackUpdateInput) {
  return await prisma.stack.update({ where: { id }, data: stackUpdateInput })
}

export async function updateUser(userMail: string, userUpdateInput: Prisma.UserUpdateInput) {
  return await prisma.user.update({ where: { email: userMail }, data: userUpdateInput })
}

export async function createComment(data: Prisma.CommentCreateInput) {
  return await prisma.comment.create({ data })
}