'use client'

import { Label } from "./ui/label"
import { Input } from "./ui/input"
import { createExternalLink } from "../app/actions"
import { useState } from "react"
import { Button } from "./ui/button"
import { useToast } from "./ui/use-toast"
import { useRouter } from "next/navigation"

const InputGroup = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col gap-2 bg-accent/10 p-4 rounded-md">
    {children}
  </div>
)

export default function ExternalLinkForm({ onSubmit, isLoading }: { onSubmit: (title: string, url: string, logoWhite: string, logoBlack: string) => void, isLoading: boolean }) {
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [logoWhite, setLogoWhite] = useState('')
  const [logoBlack, setLogoBlack] = useState('')

  return (
    <div className="flex flex-col gap-2">
      <InputGroup>
        <Label>Title</Label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} />
      </InputGroup>
      <InputGroup>
        <Label>URL</Label>
        <Input value={url} onChange={(e) => setUrl(e.target.value)} />
      </InputGroup>
      <InputGroup>
        <Label>Logo (light)</Label>
        <Input value={logoWhite} onChange={(e) => setLogoWhite(e.target.value)} />
      </InputGroup>
      <InputGroup>
        <Label>Logo (black)</Label>
        <Input value={logoBlack} onChange={(e) => setLogoBlack(e.target.value)} />
      </InputGroup>
      {title.trim() !== '' && url.trim() !== '' && (
        <Button onClick={() => onSubmit(title, url, logoWhite, logoBlack)} disabled={isLoading}>{isLoading ? 'Adding...' : 'Add'}</Button>
      )}
    </div>
  )
}

