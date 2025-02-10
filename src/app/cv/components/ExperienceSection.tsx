import React from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { Section } from './Section'
import { ExperienceForm, ExperienceFormData } from './ExperienceForm'
import { CVData } from '@/types/CV'

interface ExperienceSectionProps {
  data: CVData
  language: string
  showExpDialog: boolean
  setShowExpDialog: (show: boolean) => void
  editingExp: ExperienceFormData | null
  setEditingExp: (exp: ExperienceFormData | null) => void
  onAddExperience: (data: ExperienceFormData) => void
  onEditExperience: (index: number, data: ExperienceFormData) => void
  onDeleteExperience: (index: number) => void
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({
  data,
  language,
  showExpDialog,
  setShowExpDialog,
  editingExp,
  setEditingExp,
  onAddExperience,
  onEditExperience,
  onDeleteExperience
}) => (
  <Section title={language === 'en' ? 'Experiences' : 'Expérience Professionnelle'}>
    <div className="flex justify-between items-center">
      <Dialog open={showExpDialog} onOpenChange={setShowExpDialog}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Experience
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Experience</DialogTitle>
          </DialogHeader>
          <ExperienceForm
            onSubmit={onAddExperience}
            onCancel={() => setShowExpDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
    {data.experience && data.experience.map((exp, index) => (
      <article key={index} className='glassPanel relative'>
        <div className="absolute top-2 right-2 flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setEditingExp({
              place: exp.place ?? '',
              title: exp.title ?? '',
              period: exp.period ?? '',
              description: exp.description || [],
              link: exp.link ?? ''
            })}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDeleteExperience(index)}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
        <h4 className='text-md'>
          {exp.link ? (
            <a 
              href={exp.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:underline text-primary"
            >
              {exp.place} - {exp.title}
            </a>
          ) : (
            exp.place + ' - ' + exp.title
          )}
        </h4>
        <p className='text-sm uppercase'>{exp.period}</p>
        <div className="pl-4">
          <div className='text-sm'>
            {exp.description && exp.description.map((resp, respIndex) => (
              <p key={respIndex}>{resp}</p>
            ))}
          </div>
        </div>
      </article>
    ))}

    {/* Edit Experience Dialog */}
    <Dialog open={!!editingExp} onOpenChange={(open) => !open && setEditingExp(null)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Experience</DialogTitle>
        </DialogHeader>
        {editingExp && (
          <ExperienceForm
            initialData={editingExp}
            onSubmit={(formData) => {
              const index = data.experience?.findIndex(
                exp => exp.place === editingExp.place && exp.title === editingExp.title
              )
              if (index !== undefined && index !== -1) {
                onEditExperience(index, formData)
              }
            }}
            onCancel={() => setEditingExp(null)}
          />
        )}
      </DialogContent>
    </Dialog>
  </Section>
) 