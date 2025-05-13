import { useTranslations } from 'next-intl'
import { StackExtended } from '@/types/stack'
import ContactSection from '@/components/ContactSection'
import MyStacksSession from './my-stacks-session'
import ProjectSection from '@/components/ProjectSection'
import { Project } from '@prisma/client'

export default function LandingPage({ stacks, session, projects }: { stacks: StackExtended[], session: any, projects: Project[] }) {
  const t = useTranslations('LandingPage')

  return (
    <>
      <MyStacksSession stacks={stacks} session={session} />
      <ContactSection />
      <ProjectSection projects={projects} session={session} />
    </>
  )
}