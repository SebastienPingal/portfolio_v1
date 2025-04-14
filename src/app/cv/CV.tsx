'use client'

import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import { useTheme } from 'next-themes'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { CVData } from '@/types/CV'
import { PDFRenderer, PDFDocumentRenderer } from '@/components/PDFRenderer'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { getStacks } from '@/app/actions'
import { Stack } from '@prisma/client'
import { ExperienceSection } from './components/ExperienceSection'
import { EducationSection } from './components/EducationSection'
import { EducationForm } from './components/EducationForm'
import { SkillsSection } from './components/SkillsSection'
import { ExperienceForm, ExperienceFormData } from './components/ExperienceForm'
import { EducationFormData } from './components/EducationForm'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import type { DragEndEvent } from '@dnd-kit/core'
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { pdf } from '@react-pdf/renderer'
import { saveAs } from 'file-saver'
import { ActivitiesSection } from './components/ActivitiesSection'

const MeBlack = '/img/me_black.svg'
const MeWhite = '/img/me_white.svg'

const CV: React.FC<{
  data: CVData
  language?: string
  showMe?: boolean
  onDataChange?: (data: CVData) => void
  isUserConnected: boolean
}> = ({ data, language = 'en', showMe = false, onDataChange, isUserConnected }) => {
  const { theme } = useTheme()
  const [me, setMe] = useState(MeBlack)

  useEffect(() => {
    setMe(theme === 'light' ? MeBlack : MeWhite)
  }, [theme])

  const [showPDF, setShowPDF] = useState(false)
  const [editingExp, setEditingExp] = useState<ExperienceFormData | null>(null)
  const [availableStacks, setAvailableStacks] = useState<Stack[]>([])
  const [showExpDialog, setShowExpDialog] = useState(false)
  const [editingEdu, setEditingEdu] = useState<EducationFormData | null>(null)
  const [showEduDialog, setShowEduDialog] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  useEffect(() => {
    const loadStacks = async () => {
      const stacks = await getStacks()
      setAvailableStacks(stacks)
    }
    loadStacks()
  }, [])

  const handleEdit = (newData: Partial<CVData>) => {
    if (onDataChange) {
      onDataChange({
        ...data,
        ...newData
      })
    }
  }

  const handleContactEdit = (index: number, field: 'value' | 'link', value: string) => {
    if (!onDataChange || !data.contact) return

    const newContacts = [...data.contact]
    newContacts[index] = {
      ...newContacts[index],
      [field]: value
    }

    handleEdit({ contact: newContacts })
  }

  const handleAddExperience = (formData: ExperienceFormData) => {
    if (!onDataChange) return

    const newExperience = {
      place: formData.place,
      title: formData.title,
      period: formData.period,
      description: formData.description,
      order: data.experience?.length ?? 0
    }

    handleEdit({
      experience: [...(data.experience || []), newExperience]
    })
    setShowExpDialog(false)
  }

  const handleEditExperience = (index: number, formData: ExperienceFormData) => {
    if (!onDataChange || !data.experience) return

    const updatedExperiences = [...data.experience]
    updatedExperiences[index] = {
      ...updatedExperiences[index],
      ...formData
    }

    handleEdit({ experience: updatedExperiences })
    setEditingExp(null)
  }

  const handleDeleteExperience = (index: number) => {
    if (!onDataChange || !data.experience) return

    const updatedExperiences = data.experience.filter((_, i) => i !== index)
    handleEdit({ experience: updatedExperiences })
  }

  const handleAddEducation = (formData: EducationFormData) => {
    if (!onDataChange) return

    const newEducation = {
      title: formData.title,
      period: formData.period,
      description: formData.description,
      place: '' // Add a default or appropriate value for 'place'
    }

    handleEdit({
      education: [...(data.education || []), newEducation]
    })
    setShowEduDialog(false)
  }

  const handleEditEducation = (index: number, formData: EducationFormData) => {
    if (!onDataChange || !data.education) return

    const updatedEducation = [...data.education]
    updatedEducation[index] = {
      ...updatedEducation[index],
      ...formData
    }

    handleEdit({ education: updatedEducation })
    setEditingEdu(null)
  }

  const handleDeleteEducation = (index: number) => {
    if (!onDataChange || !data.education) return

    const updatedEducation = data.education.filter((_, i) => i !== index)
    handleEdit({ education: updatedEducation })
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over || !data.experience || !onDataChange) return

    const oldIndex = parseInt(active.id as string)
    const newIndex = parseInt(over.id as string)

    if (oldIndex === newIndex) return

    const experiences = [...data.experience]
    const [movedItem] = experiences.splice(oldIndex, 1)
    experiences.splice(newIndex, 0, movedItem)

    // Update order for all items
    const updatedExperiences = experiences.map((exp, index) => ({
      ...exp,
      order: index
    }))

    handleEdit({ experience: updatedExperiences })
  }

  const handleExportPDF = async () => {
    console.log('🔄 Exporting PDF...')
    try {
      // Use PDFDocumentRenderer instead of PDFRenderer for direct PDF generation
      const document = (
        <PDFDocumentRenderer
          data={data}
          language={language}
          theme={theme === 'light' ? 'light' : 'dark'}
        />
      )

      // Generate the blob
      const blob = await pdf(document).toBlob()

      // Generate filename based on user's name or default
      const filename = `${data.name?.replace(/\s+/g, '_').toLowerCase() || 'cv'}.pdf`

      // Save the file
      saveAs(blob, filename)
      console.log('✅ PDF exported successfully!')
    } catch (error) {
      console.error('❌ Error exporting PDF:', error)
    }
  }

  if (!data) return null

  if (showPDF) {
    return (
      <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm h-full">
        <div className="fixed inset-10">
          <Button
            onClick={() => setShowPDF(false)}
            className="absolute top-2 right-36 z-10"
          >
            Close
          </Button>
          <PDFRenderer data={data} language={language} theme={theme === 'light' ? 'light' : 'dark'} />
        </div>
      </div>
    )
  }

  return (
    <>
      <div className='flex gap-2 mb-4'>
        <Button onClick={handleExportPDF} variant='secondaryshine'>
          <Download className='w-4 h-4 mr-2' /> {language === 'en' ? 'Export' : 'Exporter'}
        </Button>
        <Button onClick={() => setShowPDF(true)}>
          <Download className='w-4 h-4 mr-2' /> {language === 'en' ? 'Preview' : 'Aperçu'}
        </Button>
      </div>
      <div className='relative'>
        <div className="glassPanel flex flex-col gap-2 aspect-[1/1.4134]">
          <header className='flex gap-2 items-center ml-8 justify-between px-4'>
            <div className='flex gap-2 items-center'>
              <div className={`relative cursor-pointer transition-transform flex-shrink-0 w-20 h-20`}>
                {showMe && <Image src={me} alt="Me" fill={true} />}
              </div>
              <div>
                {isUserConnected ? (
                  <>
                    <Input
                      value={data.name ?? ''}
                      onChange={(e) => handleEdit({ name: e.target.value })}
                      className="text-2xl font-bold"
                    />
                    <Input
                      value={data.title ?? ''}
                      onChange={(e) => handleEdit({ title: e.target.value })}
                    />
                  </>
                ) : (
                  <>
                    <p className="text-2xl font-bold">{data.name}</p>
                    <p>{data.title}</p>
                  </>
                )}
              </div>
            </div>
            <div>
              <div className='text-sm text-justify flex flex-col gap-1'>
                {data.contact && data.contact.map((contact, index) => (
                  contact.value && (
                    <div key={contact.key} className="flex gap-2">
                      {isUserConnected ? (
                        <>
                          <Input
                            value={contact.value}
                            onChange={(e) => handleContactEdit(index, 'value', e.target.value)}
                            className="text-sm"
                          />
                          <Input
                            value={contact.link}
                            onChange={(e) => handleContactEdit(index, 'link', e.target.value)}
                            className="text-sm"
                            placeholder="Link"
                          />
                        </>
                      ) : (
                        <>
                          {contact.link && <a href={contact.link} className="text-sm">{contact.value}</a>}
                        </>
                      )}
                    </div>
                  )
                ))}
              </div>
            </div>
          </header>

          {/* {data.about &&
            <Section title={language === 'en' ? 'About me' : 'À propos'}>
              <p className='text-sm text-justify'>{data.about}</p>
            </Section>
          } */}

          <div className='flex gap-2'>

            {/* Sidebar */}
            <div className='flex flex-col gap-5 w-1/4 flex-shrink-0'>
              <SkillsSection
                data={data}
                language={language}
                availableStacks={availableStacks}
                onEdit={handleEdit}
                isUserConnected={isUserConnected}
              />
              {data.activities && (
                <ActivitiesSection
                  data={data}
                  language={language}
                />
              )}
            </div>

            {/* Main */}
            <div className='flex flex-col gap-2'>
              {data.experience && data.experience.length > 0 && (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={data.experience.map((_, index) => index.toString())}
                    strategy={verticalListSortingStrategy}
                  >
                    <ExperienceSection
                      data={data}
                      language={language}
                      showExpDialog={showExpDialog}
                      setShowExpDialog={setShowExpDialog}
                      editingExp={editingExp}
                      setEditingExp={setEditingExp}
                      onAddExperience={handleAddExperience}
                      onEditExperience={handleEditExperience}
                      onDeleteExperience={handleDeleteExperience}
                      isUserConnected={isUserConnected}
                    />
                  </SortableContext>
                </DndContext>
              )}

              {data.education &&
                <EducationSection
                  data={data}
                  language={language}
                  showEduDialog={showEduDialog}
                  setShowEduDialog={setShowEduDialog}
                  editingEdu={editingEdu}
                  setEditingEdu={setEditingEdu}
                  onAddEducation={handleAddEducation}
                  onEditEducation={handleEditEducation}
                  onDeleteEducation={handleDeleteEducation}
                  isUserConnected={isUserConnected}
                />
              }

            </div>
          </div>
        </div>
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
                  handleEditExperience(index, formData)
                }
              }}
              onCancel={() => setEditingExp(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Add Education Edit Dialog after Experience Edit Dialog */}
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
                  handleEditEducation(index, formData)
                }
              }}
              onCancel={() => setEditingEdu(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

export default CV