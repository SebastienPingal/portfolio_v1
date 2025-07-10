interface Language {
  name: string
  level: string | null
}

interface Contact {
  key: string
  value: string | undefined
  link: string | undefined
}

interface Item {
  title: string | null
  place: string | null
  placeDescription?: string | null
  period: string | null
  description: string[] | null
  link?: string | null | undefined
  order?: number
  skills?: string[] | null
}

interface CVData {
  name: string | null
  title: string | null
  yearsOfExperience?: number | null
  contact: Contact[] | null
  languages: Language[] | null
  activities: string[] | null
  skills: {
    stack: {
      name: string
      rating: number | null
    }[][] | null
    other: {
      name: string
      rating: number | null
    }[] | null
  } | null
  education: Item[] | null
  experience: Item[] | null
  about: string | null
  profileImage?: string | null
  profileImageDark?: string | null
}

interface CVProps {
  data: CVData | null
  language: string | null
  showMe?: boolean
}

// Schema object for runtime use (mirrors the CVData interface)
export const CVDataSchema = {
  name: "string | null",
  title: "string | null", 
  yearsOfExperience: "number | null (optional)",
  contact: "Array<{key: string, value: string | undefined, link: string | undefined}> | null",
  languages: "Array<{name: string, level: string | null}> | null",
  activities: "string[] | null",
  skills: "{stack: Array<Array<{name: string, rating: number | null}>> | null, other: Array<{name: string, rating: number | null}> | null} | null",
  education: "Array<{title: string | null, place: string | null, placeDescription?: string | null, period: string | null, description: string[] | null, link?: string | null, order?: number, skills?: string[] | null}> | null",
  experience: "Array<{title: string | null, place: string | null, placeDescription?: string | null, period: string | null, description: string[] | null, link?: string | null, order?: number, skills?: string[] | null}> | null",
  about: "string | null",
  profileImage: "string | null (optional)",
  profileImageDark: "string | null (optional)"
}

export type { CVData, CVProps }