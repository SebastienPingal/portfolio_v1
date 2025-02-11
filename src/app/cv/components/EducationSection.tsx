import React from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { Section } from './Section'
import { EducationForm, EducationFormData } from './EducationForm'
import { CVData } from '@/types/CV'

interface EducationSectionProps {
  data: CVData
  language: string
  showEduDialog: boolean
  setShowEduDialog: (show: boolean) => void
  editingEdu: EducationFormData | null
  setEditingEdu: (edu: EducationFormData | null) => void
  onAddEducation: (data: EducationFormData) => void
  onEditEducation: (index: number, data: EducationFormData) => void
  onDeleteEducation: (index: number) => void
  isUserConnected: boolean
}

export const EducationSection: React.FC<EducationSectionProps> = ({
  data,
  language,
  showEduDialog,
  setShowEduDialog,
  editingEdu,
  setEditingEdu,
  onAddEducation,
  onEditEducation,
  onDeleteEducation,
  isUserConnected
}) => (
  <Section title={language === 'en' ? 'Education' : 'Formation'}>
    <div className="flex justify-between items-center">
      {isUserConnected && (
        <Dialog open={showEduDialog} onOpenChange={setShowEduDialog}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Education
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Education</DialogTitle>
            </DialogHeader>
            <EducationForm
              onSubmit={onAddEducation}
              onCancel={() => setShowEduDialog(false)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
    {data.education && data.education.map((edu, index) => (
      <article key={`${edu.title}-${index}`} className='glassPanel relative'>
        <div className="absolute top-2 right-2 flex gap-2">
          {isUserConnected && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEditingEdu({
                  title: edu.title ?? '',
                  period: edu.period ?? '',
                  description: edu.description || []
                })}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDeleteEducation(index)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </>
          )}
        </div>
        <h4 className='text-md'>{edu.title}</h4>
        <p className='text-sm uppercase'>{edu.period}</p>
        <div className="pl-4">
          <div className='text-sm'>
            {edu.description && edu.description.map((desc, descIndex) => (
              <p key={`${desc}-${descIndex}`}>{desc}</p>
            ))}
          </div>
        </div>
      </article>
    ))}

    {isUserConnected && (
      <Dialog open={!!editingEdu} onOpenChange={(open) => !open && setEditingEdu(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Education</DialogTitle>
          </DialogHeader>
          {editingEdu && (
            <EducationForm
              initialData={editingEdu}
              onSubmit={(formData) => {
                const index = data.education?.findIndex(
                  edu => edu.title === editingEdu.title
                )
                if (index !== undefined && index !== -1) {
                  onEditEducation(index, formData)
                }
              }}
              onCancel={() => setEditingEdu(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    )}
  </Section>
) 