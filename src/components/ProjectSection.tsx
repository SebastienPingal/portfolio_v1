import { Project } from "@prisma/client";
import { useTranslations } from "next-intl"
import { Button } from "./ui/button";
import { PlusIcon } from "lucide-react";
import { Card, CardContent, CardHeader } from "./ui/card";

export default function ProjectSection({ projects }: { projects: Project[] }) {
  const t = useTranslations('ProjectSection')

  return (
    <div>
      <h2 className="text-4xl font-bold">{t('title')}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.length > 0 && projects.map((project) => (
          <Card key={project.id} className="hover:-translate-y-1 hover:shadow-lg border-2 hover:border-primary transition-all duration-300 cursor-pointer">
            <CardHeader className="p-4">
              <h3>{project.title}</h3>
              <p>{project.description}</p>
            </CardHeader>
          </Card>
        ))}

        <Button className="w-full col-span-full">
          <PlusIcon className="w-4 h-4 mr-2" />
          {t('addProject')}
        </Button>
      </div>
    </div>
  )
}
