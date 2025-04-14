import { CVData } from '@/types/CV'

export const englishCV: CVData = {
  name: "Sébastien Pingal",
  title: "Fullstack Developer",
  profileImage: "/img/me_black.png",
  profileImageDark: "/img/me_white.png",
  contact: [
    {
      key: "email",
      value: "sebastien.pingal@gmail.com",
      link: "mailto:sebastien.pingal@gmail.com"
    },
    {
      key: "phone",
      value: "(+33) 07 77 93 91 02",
      link: "tel:+33777939102"
    },
    {
      key: "location",
      value: "Paris, France",
      link: "https://www.google.com/maps/place/Paris,+France"
    },
    {
      key: "github",
      value: "github.com/SebastienPingal",
      link: "https://github.com/SebastienPingal"
    },
    {
      key: "linkedin",
      value: "linkedin.com/in/sebastienpingal",
      link: "https://www.linkedin.com/in/sebastienpingal"
    }
  ],
  languages: [
    {
      name: "French",
      level: "Native"
    },
    {
      name: "English",
      level: "Professional"
    },
    {
      name: "German",
      level: "Basic"
    }
  ],
  activities: [
    "Music (composition, drums)",
    "Member of the 'Majama' musical jam association",
    "Role-playing (Game Master)",
    "Member of the 'La boite à chimere' role-playing association",
    "Mountain biking",
    "Reading"
  ],
  skills: {
    stack: [
      [
        {
          name: "TypeScript",
          rating: 4
        },
        {
          name: "JavaScript",
          rating: 4
        },
        {
          name: "Node.js",
          rating: 4
        },
        {
          name: "HTML5",
          rating: 5
        },
        {
          name: "CSS3",
          rating: 5
        }
      ],
      [
        {
          name: "React.js",
          rating: 5
        },
        {
          name: "Vue.js",
          rating: 4
        },
        {
          name: "Tailwind CSS",
          rating: 5
        },
        {
          name: "Shadcn/UI",
          rating: 5
        },
        {
          name: "Pinia",
          rating: 4
        },
        {
          name: "Mapbox",
          rating: 4
        }
      ],
      [
        {
          name: "Next.js",
          rating: 5
        },
        {
          name: "Nuxt.js",
          rating: 5
        },
        {
          name: "Express.js",
          rating: 5
        },
        {
          name: "Stripe",
          rating: 5
        },
        {
          name: "PostgreSQL",
          rating: 5
        },
        {
          name: "MySQL",
          rating: 5
        },
        {
          name: "MongoDB",
          rating: 5
        },
        {
          name: "REST API",
          rating: 4
        },
        {
          name: "GraphQL",
          rating: 4
        }
      ],
      [
        {
          name: "Docker",
          rating: 5
        },
        {
          name: "CI/CD",
          rating: 5
        },
        {
          name: "Git",
          rating: 5
        },
        {
          name: "Jest",
          rating: 4
        },
        {
          name: "Cypress",
          rating: 4
        },
        {
          name: "GitLab CI/CD",
          rating: 5
        },
        {
          name: "GitHub Actions",
          rating: 5
        },
        {
          name: "AWS",
          rating: 5
        },
        {
          name: "Lambda",
          rating: 5
        },
        {
          name: "S3",
          rating: 5
        },
        {
          name: "EC2",
          rating: 5
        }
      ],
      [
        {
          name: "Figma",
          rating: 2
        },
        {
          name: "Adobe Suite",
          rating: 4
        },
        {
          name: "Jira",
          rating: 3
        },
        {
          name: "Canva",
          rating: 3
        }
      ],
      [
        {
          name: "Responsive",
          rating: 4
        },
        {
          name: "Clean Code",
          rating: 4
        }
      ]
    ],
    other: [
      {
        name: "Teaching",
        rating: 5
      },
      {
        name: "UX/UI",
        rating: 5
      },
      {
        name: "Design",
        rating: 4
      },
      {
        name: "Mathematics",
        rating: 4
      }
    ]
  },
  education: [
    {
      title: "Online Courses and Mentorship",
      place: "Udemy and Personal Mentorship",
      period: "2022 - Present",
      description: [
        "In-depth Vue.js and TypeScript training",
        "Personal mentorship",
        "Development of personal projects to apply acquired skills"
      ]
    }
  ],
  experience: [
    {
      title: "Frontend Developer",
      place: "My Portfolio",
      link: "https://sebastienpingal.dev/",
      period: "Since 2024",
      order: 0,
      description: [
        "Creation of a website for my portfolio.",
        "- Frontend development from scratch and responsive (React.js, shadcn/ui, TailwindCSS)",
        "* CV editor allowing me to quickly modify and update my information with versioning and preset system",
        "* Perlin noise generation to create a dynamic and unique background for each visit",
        "* Development of a custom component library for the site",
        "* Multilingual site management using i18n",
        "- Backend development from scratch (Next.js, Node.js, PostgreSQL)",
        "* OAuth authentication with LinkedIn",
        "* Site modularization by storing information in a PostgreSQL database to separate information management from frontend"
      ]
    },
    {
      title: "Fullstack Developer, UX/UI Designer",
      place: "Moneo Domus - Construction Company Holding",
      link: "https://moneodomus.com/",
      period: "Since March 2024",
      order: 1,
      description: [
        "Creation of a website for a construction company holding. The goal was to automate tasks and thus free up 50% of workload. MoneoDomus generates approximately €500,000 in monthly revenue.",
        "- Frontend development from scratch and responsive (React.js, shadcn/ui, TailwindCSS)",
        "* Project submission form with streamlined UX",
        "* Dashboards",
        "- Backend development from scratch (Node.js, Next.js, NextAuth, PostgreSQL)",
        "* Automated generation of quotes and invoices. From scratch as it's customized and based on a modular and modifiable structure.",
        "* Authentication with MagicLink sent by email to simplify login.",
        "* Design and management of a complex PostgreSQL database (Quote Structures, Users, Real Estate Agencies, Clients, Projects, Documents, images, etc...)",
        "* User permissions and roles management.",
        "* Integration of complex Calendly features (Round Robin) to allow appointment scheduling taking into account multiple people's schedules.",
        "- Meetings with various industry players (Real Estate Agencies, Clients, Construction Companies) to define site needs and features.",
        "- UX/UI design of pages and components updated based on user feedback and tests performed."
      ]
    },
    {
      title: "Founder, Fullstack Developer and UX/UI Designer",
      place: "KAFO - Social Network for Remote Workers",
      link: "https://www.linkedin.com/company/kafowork/posts/?feedView=all",
      period: "January 2023 - January 2024",
      order: 2,
      description: [
        "Creation of a startup. A social network for remote workers. Kafo had partnerships with several private schools and freelance communities (including Freelance Republik). An article was published in Les Echos dedicated to the platform.",
        "- Backend development in no-code from scratch (Xano)",
        "* Event generation management.",
        "* Google Maps scraping to find and list public places suitable for work.",
        "- Frontend development in nocode from scratch and responsive (Weweb)",
        "* Implementation of interactive map with filters (\"Open\", \"Within x kilometers radius\", \"Active\"...)",
        "* Design, development, and wording of a Landing Page",
        "- Complete frontend overhaul in Vue 3",
        "* To optimize site speed and simplify maintenance, all previously nocode-developed features were redeveloped from scratch",
        "* Implementation of a component library (Primevue)",
        "* Development of various statistical and administrative dashboards",
        "- Setup and execution of UX user testing",
        "- Frontend deployment with CI/CD Github on AWS EC2"
      ]
    },
    {
      title: "Frontend Developer",
      place: "Aestima Immo",
      link: "https://www.linkedin.com/company/aestima-immo/posts/",
      period: "September 2022 - March 2024",
      order: 4,
      description: [
        "Refactoring and feature additions on a real estate investment simulation website (Team of 3 fullstack devs). The site was poorly developed and both frontend and backend needed major cleanup.",
        "- Frontend overhaul (Vue 2)",
        "* Simplification of all interfaces to improve responsiveness and user comfort.",
        "* Integration of a component library (Primevue) and site modularization to create consistency across the site and facilitate maintenance.",
        "* Landing page overhaul",
        "* Implementation of customizable PDF export of simulations",
        "- Backend overhaul (Node.js, Express, Axios)",
        "* Complete overhaul of business logic and moving it to the backend.",
        "* Billing system overhaul with Stripe",
        "* Addition of business features (Team and collaborator management, Malraux devices)"
      ]
    },
    {
      title: "Frontend Developer, UX/UI Designer",
      place: "Art Factory",
      link: "",
      period: "November 2023 - January 2024",
      order: 3,
      description: [
        "Development and maintenance of a private artistic events management website for an association. (Next.js, Node.js, PostgreSQL)",
        "- Frontend development (React, tailwindCSS)",
        "* Creation of a component library for the site (based on shadcn/ui):",
        "* Design and development of statistical dashboards",
        "* Design and development of an event management interface (creation, modification, deletion, consultation)",
        "- Backend development (Node.js, Express, PostgreSQL)",
        "* Creation of an API for event management",
        "* User permissions and roles management",
        "* Management of event registrations and associated workshops"
      ]
    },
    {
      title: "Composer/Sound Engineer",
      place: "Brouillard",
      link: "https://soundcloud.com/unbrouillard",
      period: "2015 - 2023",
      order: 5,
      description: [
        "Composition, Mix/Master of tracks for artists, films, video games and theater plays"
      ]
    },
    {
      title: "Video Editor",
      place: "Freelance",
      period: "2013 - 2015",
      order: 6,
      description: [
        ""
      ]
    }
  ],
  about: "Full Stack Developer passionate about innovation, I recently designed and developed moneodomus.com, a complex web platform for managing real estate projects, enabling collaboration between different industry players (agencies, builders, architects). Co-founder of KAFO, a startup dedicated to reducing remote worker isolation, I rely on a previous 6-year experience in the music industry that has given me strong adaptability and creativity. I am comfortable with modern technologies like Docker and CI/CD, and I am always ready to learn new methods and languages."
} 