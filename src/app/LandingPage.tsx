import { StackExtended } from '@/types/stack'
import { ProjectWithTranslations } from '@/types/project'
import ExperienceSection from '@/components/ExperienceSection'
import MyStacksSession from './my-stacks-session'
import ProjectSection from '@/components/ProjectSection'

export default function LandingPage({ stacks, session, projects }: { stacks: StackExtended[], session: any, projects: ProjectWithTranslations[] }) {
  return (
    <>
      <ExperienceSection />
      <ProjectSection projects={projects} session={session} />
      <MyStacksSession stacks={stacks} session={session} />
    </>
  )
}
