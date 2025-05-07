import React from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus, Edit, Trash2, GripVertical } from 'lucide-react'
import { Section } from './Section'
import { ExperienceForm, ExperienceFormData } from './ExperienceForm'
import { CVData } from '@/types/CV'
import { useDraggable, useDroppable } from '@dnd-kit/core'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

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
  isUserConnected: boolean
}

const SortableExperience = ({ exp, index, isUserConnected, onEdit, onDelete }: {
  exp: any
  index: number
  isUserConnected: boolean
  onEdit: () => void
  onDelete: () => void
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: index.toString(),
    disabled: !isUserConnected
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 2 : 1,
    opacity: isDragging ? 0.8 : undefined,
    position: 'relative' as const
  }

  return (
    <article
      ref={setNodeRef}
      style={style}
      className={`glassPanel relative ${isDragging ? 'shadow-lg' : ''}`}
    >
      {isUserConnected && (
        <div
          {...attributes}
          {...listeners}
          className="absolute top-2 left-2 cursor-grab active:cursor-grabbing"
        >
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </div>
      )}

      <div className="absolute top-2 right-2 flex gap-2">
        {isUserConnected && (
          <>
            <Button variant="ghost" size="sm" onClick={onEdit}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onDelete}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </>
        )}
      </div>
      <h4 className='text-md font-bold'>
        {exp.link ? (
          <a
            href={exp.link}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline text-accent"
          >
            {exp.place}
          </a>
        ) : (
          exp.place
        )}
      </h4>
      <p className='text-sm uppercase text-accent'><b>{exp.title}</b> - {exp.period}</p>
      <div className="pl-4">
        <div className='text-sm font-bold'>
          {exp.description && exp.description.map((resp: string, respIndex: number) => {
            const cleanedResp = resp.startsWith('*') ? `• ${resp.substring(1)}` : resp
            return (
              <p key={respIndex} className={`${resp.startsWith('-') ? 'pl-2 font-medium' : resp.startsWith('*') ? 'pl-6 text-foreground/80 font-medium' : ''}`}>
                {cleanedResp}
              </p>
            )
          })}
        </div>
      </div>
    </article>
  )
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
  onDeleteExperience,
  isUserConnected
}) => {
  const { setNodeRef } = useDroppable({
    id: 'droppable'
  })

  // Sort experiences by order before rendering
  const sortedExperiences = data.experience?.slice().sort((a, b) =>
    (a.order ?? 0) - (b.order ?? 0)
  )

  return (
    <Section title={language === 'en' ? 'Experiences' : 'Expériences Professionnelles'}>
      <div className="flex justify-between items-center">
        {isUserConnected && (
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
        )}
      </div>
      <div ref={setNodeRef}>
        {sortedExperiences && sortedExperiences.map((exp, index) => (
          <SortableExperience
            key={index}
            exp={exp}
            index={index}
            isUserConnected={isUserConnected}
            onEdit={() => setEditingExp({
              place: exp.place ?? '',
              title: exp.title ?? '',
              period: exp.period ?? '',
              description: exp.description || [],
              link: exp.link ?? '',
              order: exp.order
            })}
            onDelete={() => onDeleteExperience(index)}
          />
        ))}
      </div>

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
} 