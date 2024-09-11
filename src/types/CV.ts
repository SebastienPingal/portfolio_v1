interface Language {
  name: string;
  level: string;
}

interface Contact {
  github: string;
  email: string;
  phone: string;
  location: string;
}

interface Experience {
  title: string;
  company: string;
  period: string;
  responsibilities: string[];
}

interface CVData {
  name: string;
  title: string;
  contact: Contact;
  languages: Language[];
  skills: {
    stack: {
      name: string;
      rating: number;
    }[];
    other: {
      name: string;
      rating: number;
    }[];
  };
  formation: string;
  experience: Experience[];
  about: string;
}

interface CVProps {
  data: CVData;
}

export type { CVData, CVProps }