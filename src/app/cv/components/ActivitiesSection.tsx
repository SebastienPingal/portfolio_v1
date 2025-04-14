import { CVData } from "@/types/CV"
import { Section } from "./Section"

export const ActivitiesSection = ({ data, language }: { data: CVData, language: string }) => {
  return (
    <Section title={language === 'en' ? 'Activities' : 'Activités'} className="flex flex-col gap-5">
      <div className="flex flex-col gap-5">
        {data.activities?.map((activity, index) => (
          <div key={index} className="text-sm">{activity}</div>
        ))}
      </div>
    </Section>
  )
}
