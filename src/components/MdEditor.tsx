"use client"
import { useState } from 'react'

import { Columns2, Rows2 } from 'lucide-react'
import MarkdownInterpreter from './MarkdownInterpreter'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'

const MdEditor = ({ md, className, onMdChange }: { md: string; className?: string; onMdChange: (md: string) => void }) => {
  const [markdown, setMarkdown] = useState(md)
  const [isFlexRow, setIsFlexRow] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMarkdown(e.target.value)
    onMdChange(e.target.value)
  }

  const [textareaHeight, setTextareaHeight] = useState<string>('96')
  const handleResize = (e: React.UIEvent<HTMLTextAreaElement>) => {
    setTextareaHeight(e.currentTarget.style.height)
  }

  const toggleFlexDirection = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setIsFlexRow(!isFlexRow)
  }

  return (
    <div className={`${className} relative flex flex-col ${isFlexRow ? 'lg:flex-row' : 'lg:flex-col'} gap-3`}>
      <Textarea
        onChange={handleChange}
        onResize={handleResize}
        defaultValue={markdown}
        className='w-full h-96 p-2 rounded shadow-inner resize-y'
      />
      <Button onClick={toggleFlexDirection} variant="outline" className='absolute top-2 right-2'>
        {isFlexRow ? <Rows2 color='hsl(var(--secondary-foreground))' /> : <Columns2 color='hsl(var(--secondary-foreground))' />}
      </Button>
      <div style={{ height: textareaHeight }} className='w-full overflow-auto p-2 rounded bg-primary/80 text-primary-foreground'>
        <MarkdownInterpreter className="flex flex-col gap-3" content={markdown} />
      </div>
    </div>
  )
}

export default MdEditor