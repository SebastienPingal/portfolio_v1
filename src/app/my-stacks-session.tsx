import StackBadge from "@/components/StackBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StackExtended } from "@/types/stack";
import { useTranslations } from "next-intl";

export default function MyStacksSession({ stacks }: { stacks: StackExtended[] }) {
  const t = useTranslations('LandingPage')

  const my_back_stacks = ['next.js', 'typescript', 'node.js', 'postgressql', 'docker', 'aws']
  const my_front_stacks = ['tailwind', 'react', 'next.js', 'typescript']
  const selectedBackStacks = stacks.filter(stack => my_back_stacks.includes(stack.title.toLowerCase()))
  const selectedFrontStacks = stacks.filter(stack => my_front_stacks.includes(stack.title.toLowerCase()))

  return (
    <div className="flex flex-col md:flex-row gap-4 justify-center">
      <Card className='flex flex-col gap-2 justify-center w-fit'>
        <CardHeader>
          <CardTitle className='text-center'>Frontend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex flex-wrap gap-2 justify-center'>
            {selectedFrontStacks.map(stack => (
              <StackBadge key={stack.title} stack={stack} />
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className='flex flex-col gap-2 justify-center w-fit'>
        <CardHeader>
          <CardTitle className='text-center'>Backend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex flex-wrap gap-2 justify-center'>
            {selectedBackStacks.map(stack => (
              <StackBadge key={stack.title} stack={stack} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}