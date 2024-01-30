"use client"
import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Textarea } from './ui/textarea'
import { Button } from './ui/button'
import { Columns2, Rows2 } from 'lucide-react'

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

  return (
    <div className={`${className} flex flex-col ${isFlexRow ? 'lg:flex-row' : 'lg:flex-col'} gap-3`}>
      <Textarea
        onChange={handleChange}
        onResize={handleResize}
        defaultValue={markdown}
        className='w-full h-96 p-2 rounded shadow-inner resize-y'
      />
      <div style={{ height: textareaHeight }} className='w-full relative overflow-auto p-2 rounded bg-primary/80 text-primary-foreground'>
        <ReactMarkdown remarkPlugins={[remarkGfm]} className="flex flex-col gap-3">
          {markdown}
        </ReactMarkdown>
        <Button onClick={() => setIsFlexRow(!isFlexRow)} variant="outline" className='absolute bottom-2 right-2'>
          {isFlexRow ? <Rows2 color='hsl(var(--secondary-foreground))' /> : <Columns2 color='hsl(var(--secondary-foreground))' />}
        </Button>
      </div>
    </div>
  )
}

export default MdEditor