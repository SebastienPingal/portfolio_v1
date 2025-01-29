import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Plus, Trash2 } from 'lucide-react'

export interface EducationFormData {
  title: string
  period: string
  description: string[]
}

interface EducationFormProps {
  initialData?: EducationFormData
  onSubmit: (data: EducationFormData) => void
  onCancel: () => void
}

export const EducationForm: React.FC<EducationFormProps> = ({
  initialData,
  onSubmit,
  onCancel
}) => {
  const [formData, setFormData] = useState<EducationFormData>(initialData || {
    title: '',
    period: '',
    description: ['']
  })

  return (
    <div className="flex flex-col gap-4">
      <Input
        placeholder="Degree/Certificate Title"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
      />
      <Input
        placeholder="Period (e.g., 2020-2021)"
        value={formData.period}
        onChange={(e) => setFormData({ ...formData, period: e.target.value })}
      />
      {formData.description.map((desc, index) => (
        <div key={index} className="flex gap-2">
          <Textarea
            placeholder="Description"
            value={desc}
            onChange={(e) => {
              const newDesc = [...formData.description]
              newDesc[index] = e.target.value
              setFormData({ ...formData, description: newDesc })
            }}
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const newDesc = formData.description.filter((_, i) => i !== index)
              setFormData({ ...formData, description: newDesc })
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setFormData({
          ...formData,
          description: [...formData.description, '']
        })}
      >
        <Plus className="h-4 w-4 mr-2" /> Add Description
      </Button>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={() => onSubmit(formData)}>Save</Button>
      </div>
    </div>
  )
} 