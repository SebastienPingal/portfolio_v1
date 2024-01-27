'use server'
import prisma from '@/lib/db'

export async function getStacks() {
  return await prisma.stack.findMany()
}



