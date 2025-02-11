'use server'
import prisma from '@/lib/db'
import { Prisma, PostType } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { CVData } from '@/types/CV'

export async function getUser(data: Prisma.UserWhereUniqueInput) {
  return await prisma.user.findUnique({ where: data })
}

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

/* CV PRESETS */

interface CVPresetData {
  title: string
  data: CVData
}

export async function saveCVPreset(userId: string, title: string, data: CVData) {
  const existingPreset = await prisma.cV.findUnique({
    where: {
      title_userId: {
        title,
        userId
      }
    }
  })

  if (existingPreset) {
    return await prisma.cV.update({
      where: {
        id: existingPreset.id
      },
      data: {
        data: data as any // Type assertion needed due to Prisma Json type
      }
    })
  }

  return await prisma.cV.create({
    data: {
      title,
      data: data as any, // Type assertion needed due to Prisma Json type
      userId
    }
  })
}

export async function getCVPresets(userId?: string) {
  if (!userId) {
    const user = await getUser({ email: process.env.NEXT_PUBLIC_ADMIN_EMAIL })
    if (!user) throw new Error('User not found')
    return await prisma.cV.findMany({
      where: { userId: user.id },
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        title: true,
        data: true,
        updatedAt: true
      }
    })
  } else {
    return await prisma.cV.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        title: true,
        data: true,
        updatedAt: true
      }
    })
  }
}

export async function deleteCVPreset(id: string, userId: string) {
  return await prisma.cV.delete({
    where: { 
      id,
      userId
    }
  })
}

export async function updateCVPreset(id: string, userId: string, data: Partial<CVPresetData>) {
  return await prisma.cV.update({
    where: { 
      id,
      userId
    },
    data: {
      ...data,
      data: data.data as any // Type assertion needed due to Prisma Json type
    }
  })
}