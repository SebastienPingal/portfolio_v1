'use server'
import prisma from '@/lib/db'
import { Prisma } from '@prisma/client'

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