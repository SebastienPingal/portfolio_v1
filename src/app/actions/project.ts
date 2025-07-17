'use server'
import db from '@/lib/db'
import prisma from '@/lib/db'
import { Prisma } from '@prisma/client'

export async function getProjects() {
  return await prisma.project.findMany()
}

export async function createProject(data: {
  title: { en: string; fr: string }
  description: { en: string; fr: string }
  link: string
}) {
  return await db.project.create({
    data: {
      title: data.title,
      description: data.description,
      link: data.link
    }
  })
}

export async function updateProject(id: string, project: Prisma.ProjectUpdateInput) {
  return await prisma.project.update({ where: { id }, data: project })
}

export async function deleteProject(id: string) {
  return await prisma.project.delete({ where: { id } })
}
