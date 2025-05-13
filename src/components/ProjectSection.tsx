'use client'
import { Project } from "@prisma/client"
import { useTranslations } from "next-intl"
import { Button } from "./ui/button"
import { PlusIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { useState } from "react"
import { createProject } from "@/app/actions"
import { Textarea } from "./ui/textarea"
import { Input } from "./ui/input"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

export default function ProjectSection({ projects }: { projects: Project[] }) {
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

  return (
    <div>
      <h2 className="text-4xl font-bold">{t('title')}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.length > 0 && projects.map((project) => (
          <a href={`${project.link}`} key={project.id} target="_blank" rel="noopener noreferrer">
            <Card
              className="hover:-translate-y-1 hover:shadow-lg border-2 h-full hover:border-primary transition-all duration-300">
              <CardHeader className="p-4">
                <h3>{project.title}</h3>
                <p>{project.description}</p>
              </CardHeader>
            </Card>
          </a>
        ))}

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
      </div>
    </div>
  )
}
