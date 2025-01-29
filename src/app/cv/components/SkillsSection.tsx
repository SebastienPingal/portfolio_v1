import React from 'react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Trash2 } from 'lucide-react'
import { Stack } from '@prisma/client'
import { Section } from './Section'
import { CVData } from '@/types/CV'

interface SkillsSectionProps {
  data: CVData
  language: string
  availableStacks: Stack[]
  onEdit: (data: Partial<CVData>) => void
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({
  data,
  language,
  availableStacks,
  onEdit,
}) => {
  const handleSkillEditRating = (index: number) => {
    const updatedStacks = [...(data.skills?.stack || [])]
    updatedStacks[index] = {
      ...updatedStacks[index],
      rating: updatedStacks[index].rating === 5 ? 1 : 5
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

    const updatedStacks = [...(data.skills.stack || []), newStack]
    onEdit({
      skills: {
        ...data.skills,
        stack: updatedStacks,
        other: data.skills.other ?? null
      }
    })
  }

  return (
    <Section title={language === 'en' ? 'Skills' : 'Compétences'}>
      <div className='text-sm'>
        {data?.skills?.stack && (
          <div className="flex gap-2 items-center">
            <span className="font-bold">
              {language === 'en' ? 'Technical Stack' : 'Stack Technique'}:
            </span>
            <div className="flex flex-wrap gap-1">
              {data.skills.stack.map((skill, index) => (
                <div key={`${skill.name}-${index}`} className="flex items-center gap-1">
                  <span
                    className="text-sm cursor-pointer"
                    onClick={() => handleSkillEditRating(index)}
                  >
                    {skill.name} ({skill.rating})
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const newStacks = data.skills?.stack?.filter((_, i) => i !== index)
                      onEdit({
                        skills: {
                          ...data.skills,
                          stack: newStacks ?? null,
                          other: data.skills?.other ?? null
                        }
                      })
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
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
          </div>
        )}

        {data?.skills?.other && data.skills.other.length > 0 && (
          <p>
            <span className="font-bold">{language === 'en' ? 'Other Skills' : 'Autres Compétences'}: </span>
            {data.skills.other.map((skill, i) => (
              <span key={`${skill.name}-${i}`}>
                {`${skill.name}${i < data.skills!.other!.length - 1 ? ' | ' : ''}`}
              </span>
            ))}
          </p>
        )}

        {data?.languages && data?.languages?.length > 0 && (
          <p>
            <span className="font-bold">{language === 'en' ? 'Languages' : 'Langues'}: </span>
            {data.languages.map((lang, i) => (
              <span key={`${lang.name}-${i}`}>
                {`${lang.name} (${lang.level})${i < data.languages!.length - 1 ? ' | ' : ''}`}
              </span>
            ))}
          </p>
        )}
      </div>
    </Section>
  )
} 