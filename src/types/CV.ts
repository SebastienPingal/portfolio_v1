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
  period: string | null
  description: string[] | null
}

interface CVData {
  name: string | null
  title: string | null
  contact: Contact[] | null
  languages: Language[] | null
  skills: {
    stack: {
      name: string
      rating: number | null
    }[] | null
    other: {
      name: string
      rating: number | null
    }[] | null
  } | null
  education: Item[] | null
  experience: Item[] | null
  about: string | null
}

interface CVProps {
  data: CVData | null
  language: string | null
  showMe?: boolean
}

export type { CVData, CVProps }