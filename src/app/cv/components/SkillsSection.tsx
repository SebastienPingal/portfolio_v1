import React from 'react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Trash2 } from 'lucide-react'
import { Stack } from '@prisma/client'
import { Section } from './Section'
import { CVData } from '@/types/CV'
import { cn } from '@/lib/utils'

interface SkillsSectionProps {
  data: CVData
  language: string
  availableStacks: Stack[]
  onEdit: (data: Partial<CVData>) => void
  isUserConnected: boolean
  className?: string
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({
  data,
  language,
  availableStacks,
  onEdit,
  isUserConnected,
  className
}) => {
  const handleSkillEditRating = (groupIndex: number, skillIndex: number) => {
    const updatedStacks = [...(data.skills?.stack || [])]
    updatedStacks[groupIndex][skillIndex] = {
      ...updatedStacks[groupIndex][skillIndex],
      rating: updatedStacks[groupIndex][skillIndex].rating === 5 ? 1 : 5
    }
    onEdit({
      skills: {
        stack: updatedStacks,
        other: data?.skills?.other ?? null
      }
    })
  }

  const handleStackSelect = (stackId: string) => {
    if (!data.skills) return

    const stack = availableStacks.find(s => s.id === stackId)
    if (!stack) return

    const newStack = {
      name: stack.title,
      rating: 5 // Default rating
    }

    // Add new stack to the first group, create if doesn't exist
    const updatedStacks = [...(data.skills.stack || [[]])]
    if (updatedStacks[0] === undefined) {
      updatedStacks[0] = []
    }
    updatedStacks[0].push(newStack)

    onEdit({
      skills: {
        ...data.skills,
        stack: updatedStacks,
        other: data.skills.other ?? null
      }
    })
  }
  console.log(data.skills)

  return (
    <Section title={language === 'en' ? 'Skills' : 'Compétences'}>
      <div className={cn('text-sm flex flex-col gap-2', className)}>
        {data?.skills?.stack && (
          <div className="flex gap-2 items-center">
            {isUserConnected ? (
              <>
                <span className="font-extrabold text-base">
                  {language === 'en' ? 'Technical Stack' : 'Stack Technique'}:
                </span>
                <div className="flex flex-col gap-2">
                  {data.skills.stack.map((group, groupIndex) => (
                    <div key={groupIndex} className="flex flex-wrap gap-1">
                      {group.map((skill, skillIndex) => (
                        <div key={`${skill.name}-${skillIndex}`} className="flex items-center gap-1">
                          <span
                            className="text-sm cursor-pointer"
                            onClick={() => handleSkillEditRating(groupIndex, skillIndex)}
                          >
                            {skill.name} ({skill.rating})
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const updatedStacks = [...data.skills!.stack!]
                              updatedStacks[groupIndex] = group.filter((_, i) => i !== skillIndex)
                              // Remove empty groups
                              const filteredStacks = updatedStacks.filter(group => group.length > 0)
                              onEdit({
                                skills: {
                                  ...data.skills,
                                  stack: filteredStacks,
                                  other: data.skills?.other ?? null
                                }
                              })
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ))}

                  <Select onValueChange={handleStackSelect}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Add stack" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableStacks.map(stack => (
                        <SelectItem key={`${stack.id}-${stack.title}`} value={stack.id}>
                          {stack.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            ) : (
              <div className="flex flex-col gap-2">
                <p className='font-extrabold text-base'>
                  {language === 'en' ? 'Technical Stack' : 'Stack Technique'} :
                </p>
                {data.skills.stack.map((group, groupIndex) => (
                  <div key={groupIndex} className='flex flex-wrap gap-1 text-sm'>
                    {group.map((skill, index) => (
                      <div key={`${skill.name}-${index}`}>
                        {skill.name}{index < group.length - 1 && ','}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {data?.skills?.other && data.skills.other.length > 0 && (
          <div className='flex flex-col gap-1'>
            <p className='font-extrabold text-base'>
              {language === 'en' ? 'Other Skills' : 'Autres Compétences'} :
            </p>
            <div className='flex flex-wrap gap-1 text-sm'>
              {data.skills.other.map((skill, i) => (
                <div key={`${skill.name}-${i}`}>
                  {skill.name}{i < data.skills!.other!.length - 1 && ','}
                </div>
              ))}
            </div>
          </div>
        )}

        {data?.languages && data?.languages?.length > 0 && (
          <div className='flex flex-col gap-1'>
            <p className='font-extrabold text-base'>
              {language === 'en' ? 'Languages' : 'Langues'} :
            </p>
            <div className='flex flex-col gap-1 text-sm'>
              {data.languages.map((lang, i) => (
                <div key={`${lang.name}-${i}`}>
                  {lang.name} ({lang.level}){i < data.languages!.length - 1 && ','}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Section>
  )
} 