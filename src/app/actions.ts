'use server'
import prisma from '@/lib/db'
import { Prisma, PostType, Stack } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { CVData } from '@/types/CV'
import { Resend } from 'resend'
import { StackExtended } from '@/types/stack'

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

export async function getStacks(): Promise<StackExtended[]> {
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

//email

export async function sendEmail(data: {
  name: string
  email: string
  message: string
}) {
  const resend = new Resend(process.env.RESEND_API_KEY)

  resend.emails.send({
    from: 'Acme <onboarding@resend.dev>',
    to: 'sebastien.pingal@gmail.com',
    subject: 'Nouveau message de ' + data.name,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #f8f9fa; padding: 20px; border-radius: 8px 8px 0 0; }
            .content { background-color: white; padding: 20px; border-radius: 0 0 8px 8px; }
            .footer { margin-top: 20px; font-size: 12px; color: #6c757d; }
            .message-box { 
              background-color: #f8f9fa;
              border-left: 4px solid #007bff;
              padding: 15px;
              margin: 10px 0;
              border-radius: 4px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>📬 Nouveau message reçu</h2>
            </div>
            <div class="content">
              <p><strong>De:</strong> ${data.name}</p>
              <p><strong>Email:</strong> ${data.email}</p>
              
              <div class="message-box">
                <p><strong>Message:</strong></p>
                <p>${data.message.replace(/\n/g, '<br>')}</p>
              </div>
            </div>
            <div class="footer">
              <p>Cet email a été envoyé via votre formulaire de contact.</p>
            </div>
          </div>
        </body>
      </html>
    `
  })
} 