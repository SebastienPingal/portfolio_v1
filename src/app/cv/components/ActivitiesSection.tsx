import { CVData } from "@/types/CV"

export const ActivitiesSection = ({ data, language }: { data: CVData, language: string }) => {
  return (
    <div>
      <h2>{language === 'en' ? 'Activities' : 'Activités'}</h2>
      <div>
        {data.activities?.map((activity, index) => (
          <div key={index}>{activity}</div>
        ))}
      </div>
    </div>
  )
}
