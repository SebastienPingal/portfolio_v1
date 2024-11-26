'use client'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Button } from "./ui/button"
import { Plus } from "lucide-react"
import ExternalLinkForm from "./ExternalLinkForm"
import { useState } from "react"
import { useToast } from "./ui/use-toast"
import { useRouter } from "next/navigation"
import { createExternalLink } from "@/app/actions"

const ExternalLinkAddDialog = () => {
  const { toast } = useToast()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const handleSubmit = async (title: string, url: string, logoWhite: string, logoBlack: string) => {
    try {
      setIsLoading(true)
      await createExternalLink({ title, url, logoWhite, logoBlack })
      toast({
        title: 'External link created',
        description: 'Your external link has been created',
      })
      router.refresh()
      setOpen(false)
    } catch (error) {
      console.error('Failed to create external link:', error)
      toast({
        title: 'Failed to create external link',
        description: 'Please try again later',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="w-full">
        <Button variant="outline" size='sm' className="w-full text-foreground">
          <Plus className="w-6 h-6" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Add external link
          </DialogTitle>
          <DialogDescription className="pb-4">
            Add an external link to your profile.
          </DialogDescription>
          <ExternalLinkForm onSubmit={handleSubmit} isLoading={isLoading} />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default ExternalLinkAddDialog