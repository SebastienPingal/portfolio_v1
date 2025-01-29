import React from 'react'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import { CVData } from '@/types/CV'

interface CVHeaderProps {
  data: CVData
  showMe: boolean
  me: string
  onEdit: (data: Partial<CVData>) => void
  onContactEdit: (index: number, field: 'value' | 'link', value: string) => void
}

export const CVHeader: React.FC<CVHeaderProps> = ({
  data,
  showMe,
  me,
  onEdit,
  onContactEdit
}) => (
  <header className='flex gap-2 items-center ml-8 justify-between px-4'>
    <div className='flex gap-2 items-center'>
      <div className={`relative cursor-pointer transition-transform flex-shrink-0 w-20 h-20`}>
        {showMe && <Image src={me} alt="Me" fill={true} />}
      </div>
      <div>
        <Input
          value={data.name || ''}
          onChange={(e) => onEdit({ name: e.target.value })}
          className="text-2xl font-bold"
        />
        <Input
          value={data.title || ''}
          onChange={(e) => onEdit({ title: e.target.value })}
        />
      </div>
    </div>
    <div>
      <p className='text-sm text-justify flex flex-col gap-1'>
        {data.contact && data.contact.map((contact, index) => (
          contact.value && (
            <div key={contact.key} className="flex gap-2">
              <Input
                value={contact.value}
                onChange={(e) => onContactEdit(index, 'value', e.target.value)}
                className="text-sm"
              />
              <Input
                value={contact.link}
                onChange={(e) => onContactEdit(index, 'link', e.target.value)}
                className="text-sm"
                placeholder="Link"
              />
            </div>
          )
        ))}
      </p>
    </div>
  </header>
) 