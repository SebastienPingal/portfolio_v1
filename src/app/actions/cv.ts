'use server'
import prisma from '@/lib/db'
import { CVData } from '@/types/CV'
import { getUser } from './user'

interface CVPresetData {
  title: string
  data: CVData
}

export async function saveCVPreset(userId: string, title: string, data: CVData) {
  if (data.experience) {
    data.experience = data.experience.map((exp, index) => ({
      ...exp,
      order: exp.order ?? index
    }))
  }

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
        data: data as any
      }
    })
  }

  return await prisma.cV.create({
    data: {
      title,
      data: data as any,
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
  }
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
      data: data.data as any
    }
  })
} 