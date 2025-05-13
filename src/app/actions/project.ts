'use server'
import prisma from '@/lib/db'
import { Prisma } from '@prisma/client'

export async function getProjects() {
  return await prisma.project.findMany()
}

export async function createProject(project: Prisma.ProjectCreateInput) {
  return await prisma.project.create({ data: project })
}

export async function updateProject(id: string, project: Prisma.ProjectUpdateInput) {
  return await prisma.project.update({ where: { id }, data: project })
}

export async function deleteProject(id: string) {
  return await prisma.project.delete({ where: { id } })
}
