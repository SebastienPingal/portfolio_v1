'use client'

import { useState } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Stack } from '@prisma/client'

interface StackUpdaterProps {
  initialStack?: Stack
  handleSubmit: (stack: Stack) => void
}

const StackEditor = ({ initialStack = { id: '', title: '', logo: '', description: '', link: '', icon: '', order: 0 }, handleSubmit }: StackUpdaterProps) => {
  const [title, setTitle] = useState(initialStack.title)
  const [logo, setLogo] = useState(initialStack.logo)
  const [description, setDescription] = useState(initialStack.description)
  const [externalLink, setExternalLink] = useState(initialStack.link)

  return (
    <form className='flex flex-col gap-4' onSubmit={(e) => {
      e.preventDefault()
      const updatedStack = { ...initialStack, title, logo, description, link: externalLink }
      handleSubmit(updatedStack)
    }}
    >
      <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <Input placeholder="Logo" value={logo} onChange={(e) => setLogo(e.target.value)} />
      <Input placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
      <Input placeholder="External Link" value={externalLink} onChange={(e) => setExternalLink(e.target.value)} />
      <Button type="submit">
        Save Stack
      </Button>
    </form>
  )
}

export default StackEditor

