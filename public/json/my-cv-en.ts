import { CVData } from '@/types/CV'

export const englishCV: CVData = {
  name: "Sébastien Pingal",
  about:
    "Full Stack TypeScript Developer with 5 years of experience, specializing in Node.js, React, Next.js, Vue.js, and PostgreSQL. I work end-to-end on web products: REST API architecture, product-oriented interfaces, authentication, Docker, and CI/CD. I am used to startup environments, from-scratch development, and product discovery.",
  title: "Full Stack TypeScript Developer",
  subtitle: "Node.js · React · Next.js · Vue.js · PostgreSQL",
  coreSkills: [
    "Full Stack TypeScript Developer",
    "Node.js",
    "React.js",
    "Next.js",
    "Vue.js",
    "PostgreSQL",
    "REST API",
    "Full stack architecture",
    "Docker",
    "CI/CD"
  ],
  yearsOfExperience: 5,
  profileImage: "/img/seb8.jpg",
  profileImagePdf: "/img/seb8-pdf.jpg",
  // "profileImage": "/img/me_black.png",
  profileImageDark: "/img/seb8.jpg",
  profileImageDarkPdf: "/img/seb8-pdf.jpg",
  // "profileImageDark": "/img/me_white.png",
  activities: [
    "Music (composition, drums)",
    "Member of the 'Majama' music jam association",
    "Role-playing games (Game Master)",
    "Member of the 'La boîte à chimère' role-playing association",
    "Mountain biking",
    "Reading"
  ],
  skills: {
    stack: [
      [
        { name: "TypeScript", rating: 4 },
        { name: "JavaScript", rating: 4 },
        { name: "Node.js", rating: 4 },
        { name: "HTML5", rating: 5 },
        { name: "CSS3", rating: 5 }
      ],
      [
        { name: "React.js", rating: 5 },
        { name: "Vue.js", rating: 4 },
        { name: "Tailwind CSS", rating: 5 },
        { name: "shadcn/ui", rating: 5 },
        { name: "Pinia", rating: 4 },
        { name: "Mapbox", rating: 4 }
      ],
      [
        { name: "Next.js", rating: 5 },
        { name: "Nuxt.js", rating: 5 },
        { name: "Express.js", rating: 5 },
        { name: "Stripe", rating: 5 },
        { name: "PostgreSQL", rating: 5 },
        { name: "MySQL", rating: 5 },
        { name: "MongoDB", rating: 5 },
        { name: "REST API", rating: 4 },
        { name: "GraphQL", rating: 4 }
      ],
      [
        { name: "Docker", rating: 5 },
        { name: "CI/CD", rating: 5 },
        { name: "Git", rating: 5 },
        { name: "Jest", rating: 4 },
        { name: "Cypress", rating: 4 },
        { name: "GitLab CI/CD", rating: 5 },
        { name: "GitHub Actions", rating: 5 },
        { name: "AWS", rating: 5 },
        { name: "Lambda", rating: 5 },
        { name: "S3", rating: 5 },
        { name: "EC2", rating: 5 }
      ],
      [
        { name: "Figma", rating: 2 },
        { name: "Adobe Suite", rating: 4 },
        { name: "Jira", rating: 3 },
        { name: "Canva", rating: 3 }
      ],
      [
        { name: "Responsive", rating: 4 },
        { name: "Clean Code", rating: 4 }
      ]
    ],
    other: [
      { name: "Teaching", rating: 5 },
      { name: "UX/UI", rating: 5 },
      { name: "Design", rating: 4 },
      { name: "Mathematics", rating: 4 }
    ]
  },

  contact: [
    { key: "email", link: "mailto:sebastien.pingal@gmail.com", value: "sebastien.pingal@gmail.com" },
    { key: "phone", link: "tel:+33777939102", value: "(+33) 07 77 93 91 02" },
    { key: "location", link: "https://www.google.com/maps/place/Paris,+France", value: "Paris, France" },
    { key: "github", link: "https://github.com/SebastienPingal", value: "github.com/SebastienPingal" },
    { key: "linkedin", link: "https://www.linkedin.com/in/sebastienpingal", value: "linkedin.com/in/sebastienpingal" }
  ],

  education: [
    {
      place: "Udemy and personal mentor",
      title: "Ongoing training in web development",
      period: "June 2021 - Present (5 years)",
      description: [
        "Further training in Vue.js, TypeScript, and full stack application design.",
        "Technical mentoring and continuous hands-on practice through personal projects."
      ]
    },
    { place: "Cifacom Montreuil", title: "Audiovisual Editing Certification", period: "September 2012 - June 2014", description: [] },
    { place: "Cifacom Montreuil", title: "Bachelor's degree in Audiovisual Directing", period: "September 2012 - June 2014", description: [] },
    { place: "IUT de Cergy-Pontoise Sarcelles", title: "University Diploma in Communication Services and Networks", period: "September 2010 - June 2012", description: [] },
    { place: "Lycée Marie-Laurencin Mennecy", title: "Scientific Baccalaureate", period: "September 2007 - June 2010", description: [] }
  ],

  languages: [
    { name: "French", level: "Native" },
    { name: "English", level: "Professional" }
    // { name: "German", level: "Basic" }
  ],

  experience: [
    {
      link: "https://jolimoi.com/",
      order: 0,
      place: "Jolimoi",
      title: "Full Stack Developer (Vue.js, Node.js, TypeScript)",
      period: "October 2025 - January 2026 (3 months)",
      skills: ["TypeScript", "Vue.js", "Node.js", "MySQL", "PHP", "PrestaShop", "Docker", "Jest", "GitHub Actions", "Notion", "Linear", "Agile", "Scrum"],
      description: [
        "Beauty social selling platform (9,000 e-shop users, 5,000 active stylists). Short-term assignment on a platform generating EUR 3M in annual revenue.",
        "- Improved the buying experience and SEO by evolving PrestaShop around discount vouchers, the gift shop, and SEO breadcrumbs.",
        "- Strengthened commercial steering with a product recommendation engine and stylist KPI tracking on the Node.js/MySQL API side.",
        "- Made these recommendations directly actionable by integrating their frontend visualizations and actions across the different sites."
      ]
    },
    {
      link: "https://moneodomus.com/",
      order: 1,
      place: "Moneo Domus",
      title: "Full Stack Developer (React.js, Node.js, TypeScript) / UX/UI",
      period: "Since January 2024 (1.5 years)",
      skills: ["TypeScript", "React.js", "Next.js", "Node.js", "PostgreSQL", "NextAuth", "shadcn/ui", "Calendly API", "MagicLink", "PDF Generation", "Client Relations", "Vercel"],
      description: [
        "Construction company holding focused on business development and support. Designed and developed from scratch a SaaS platform for a group generating around EUR 500k in monthly revenue, reducing operational workload by 50%.",
        "- Strengthened the platform from the ground up by defining the backend architecture: REST API, validation, RBAC, PostgreSQL, and error conventions.",
        "- Reduced operational processing time with a responsive React/Next.js frontend including business forms, dashboards, and shadcn/ui components.",
        "- Streamlined access and multi-stakeholder appointment booking through Magic Link authentication and Calendly integration.",
        "- Improved product adoption by leading discovery and UX iterations with agencies, clients, and construction companies."
      ]
    },
    {
      link: "https://www.linkedin.com/company/kafowork/posts/?feedView=all",
      order: 2,
      place: "KAFO",
      title: "Founder / Full Stack Developer (Vue.js, Node.js, PostgreSQL)",
      period: "February 2023 - September 2023 (8 months)",
      skills: ["TypeScript", "Vue.js", "Node.js", "Xano", "Weweb", "Google Maps API", "AWS EC2", "GitHub CI/CD", "Primevue", "No-Code", "UX/UI", "UX Testing", "Agile", "Scrum"],
      description: [
        "Social network for remote workers. Built the startup in 8 months, with several school/freelancer partnerships and press visibility up to Les Echos.",
        "- Accelerated usage validation by prototyping the product in no-code with Xano and WeWeb.",
        "- Made it easier to discover remote-work-friendly places with an interactive map and targeted search filters.",
        "- Improved performance, maintainability, and UI consistency by rebuilding the frontend in Vue 3.",
        "- Strengthened releases and the feedback loop by deploying the application on AWS EC2 with GitHub CI/CD and UX user testing."
      ]
    },
    {
      link: "",
      order: 3,
      place: "Art Factory",
      title: "Full Stack Developer (Next.js, Node.js, React.js, PostgreSQL) / UX/UI",
      period: "November 2023 - January 2024 (3 months)",
      skills: ["TypeScript", "Next.js", "React.js", "Node.js", "PostgreSQL", "Express.js", "shadcn/ui", "TailwindCSS", "API Development"],
      description: [
        "Short-term assignment on a private artistic event management application to structure the tool on both frontend and backend.",
        "- Structured operational tracking with an event administration interface and dashboards in React/Next.js.",
        "- Accelerated event management with an API featuring filters, pagination, statuses, and registration handling.",
        "- Reinforced UI consistency and access control with a component library and role/permission management."
      ]
    },
    {
      link: "https://www.linkedin.com/company/aestima-immo/posts/",
      order: 4,
      place: "Aestima Immobilier",
      title: "Full Stack Developer (Vue.js, Node.js, Express.js, PostgreSQL, Stripe)",
      period: "June 2021 - December 2023 (2.5 years)",
      skills: ["TypeScript", "Vue.js", "Node.js", "Express.js", "Stripe", "Primevue", "Axios", "Puppeteer", "Clean Code", "PDF Generation", "Refactoring", "Agile", "Scrum"],
      description: [
        "Progressive overhaul of a legacy real estate simulation application within a team of 3 full stack developers.",
        "- Improved consistency, responsiveness, and maintainability by simplifying the Vue 2 interfaces and integrating PrimeVue.",
        "- Made the Node.js/Express backend more readable and scalable by refactoring business logic with clearer separation of responsibilities.",
        "- Secured billing and expanded functional coverage by reworking Stripe and adding key features, including team management.",
        "- Accelerated client simulation production with custom PDF exports."
      ]
    },
    {
      order: 5,
      place: "My Office",
      title: "Selected personal projects",
      period: "Since June 2021 (5 years)",
      skills: ["TypeScript", "Next.js", "React.js", "Node.js", "PostgreSQL", "Tailwind CSS", "shadcn/ui", "Docker", "Chrome Extension"],
      description: [
        "3 selected personal projects to experiment with products, interfaces, and full stack architectures.",
        "- Terminal adventure: built a text role-playing game engine using generative AI to dynamically create locations, environments, and immersive descriptions.",
        "- Portfolio: accelerated CV creation with presets, PDF generation, i18n, and a Next.js/PostgreSQL backend.",
        "- DoctoNotes: enriched the Doctolib experience with a Chrome/Firefox extension displaying practitioners' Google reviews.",
        "- Cerberes: validated a minimalist E2E chat architecture deployed with Docker and CI/CD on Raspberry Pi."
      ]
    },
    {
      link: "https://soundcloud.com/unbrouillard",
      order: 6,
      place: "Prior experience (non-tech)",
      title: "Composition, sound engineering, and video editing",
      period: "2013 - 2021 (8 years)",
      skills: ["Composition", "Audio Engineering", "Mix/Master", "Sound Design", "Video Editing"],
      description: [
        "Freelance and creative background in music composition, sound design, mix/master, and video editing for artists, live performances, and audiovisual content."
      ]
    }
  ]
}