'use server'
import prisma from '@/lib/db'
import { Prisma } from '@prisma/client'

export async function getUser(data: Prisma.UserWhereUniqueInput) {
  return await prisma.user.findUnique({ where: data })
}

export async function updateUser(userMail: string, userUpdateInput: Prisma.UserUpdateInput) {
  return await prisma.user.update({ where: { email: userMail }, data: userUpdateInput })
} 