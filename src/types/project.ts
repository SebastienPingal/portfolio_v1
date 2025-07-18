import { Project } from '@prisma/client'

export interface ProjectWithTranslations extends Omit<Project, 'title' | 'description'> {
  title: { en: string; fr: string }
  description: { en: string; fr: string }
} 