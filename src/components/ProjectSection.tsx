'use client'
import { Project } from "@prisma/client"
import { useTranslations } from "next-intl"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { PlusIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { useState } from "react"
import { createProject } from "@/app/actions"
import { Textarea } from "./ui/textarea"
import { Input } from "./ui/input"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { deleteProject } from "@/app/actions/project"
import DeleteConfirmationPopover from "./DeleteConfirmationPopover"

export default function ProjectSection({ projects, session }: { projects: Project[], session: any }) {
  const t = useTranslations('ProjectSection')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', description: '', link: '' })
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title || !form.description || !form.link) {
      toast({
        title: '❗ Remplissez tous les champs',
        description: 'Veuillez remplir tous les champs du formulaire.'
      })
      return
    }
    setLoading(true)
    try {
      await createProject(form)
      toast({
        title: 'Projet ajouté!',
        description: 'Le projet a été ajouté avec succès.'
      })
      setShowForm(false)
      setForm({ title: '', description: '', link: '' })
      router.refresh()
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Erreur lors de l\'ajout du projet',
        description: 'Veuillez réessayer.'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteProject = async (id: string) => {
    try {
      await deleteProject(id)
      toast({
        title: 'Projet supprimé!',
        description: 'Le projet a été supprimé avec succès.'
      })
      router.refresh()
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Erreur lors de la suppression du projet',
        description: 'Veuillez réessayer.'
      })
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-7xl font-black text-center">{t('title')}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects
          .slice()
          .sort((a, b) => (b.new ? 1 : 0) - (a.new ? 1 : 0))
          .map((project) => (
            <div key={project.id} className="relative group">
              <a href={`${project.link}`} target="_blank" rel="noopener noreferrer">
                <Card
                  className="hover:-translate-y-1 hover:shadow-lg border-2 h-full hover:border-primary transition-all duration-300">
                  <CardHeader className="p-4 relative">
                    <div className="flex items-center gap-2">
                      <h3>{project.title}</h3>
                      {project.new && <Badge variant='shine'>{t('new')}</Badge>}
                    </div>
                    <p>{project.description}</p>
                  </CardHeader>
                </Card>
              </a>
              {session?.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL && (
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <DeleteConfirmationPopover
                    entity="project"
                    id={project.id}
                    deleteAction={handleDeleteProject}
                  />
                </div>
              )}
            </div>
          ))}

        {session?.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL && (
          <>
            {showForm ? (
              <Card>
                <CardHeader>
                  <CardTitle>Add Project</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                    <Input
                      name="title"
                      placeholder="Title"
                      value={form.title}
                      onChange={handleChange}
                      required
                    />
                    <Textarea
                      name="description"
                      placeholder="Description"
                      value={form.description}
                      onChange={handleChange}
                      required
                    />
                    <Input
                      name="link"
                      placeholder="Link"
                      value={form.link}
                      onChange={handleChange}
                      required
                    />
                    <div className="flex gap-2">
                      <Button type="submit" disabled={loading} className="w-full">
                        {loading ? '⏳ Adding...' : 'Ajouter'}
                      </Button>
                      <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                        Annuler
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            ) : (
              <Button className="w-full col-span-full" onClick={() => setShowForm(true)}>
                <PlusIcon className="w-4 h-4 mr-2" />
                {t('addProject')}
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  )
}
