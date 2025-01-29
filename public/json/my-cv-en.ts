import { CVData } from '@/types/CV'

export const englishCV: CVData = {
  name: "Sébastien Pingal",
  title: "Fullstack Developer",
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
      level: "Fluent"
    },
    {
      name: "German",
      level: "B2 Level"
    }
  ],
  skills: {
    stack: [
      {
        name: "TypeScript",
        rating: 4
      },
      {
        name: "React / Next",
        rating: 5
      },
      {
        name: "Vue / Nuxt",
        rating: 4
      },
      {
        name: "JS / Node.js",
        rating: 4
      },
      {
        name: "AWS",
        rating: 4
      },
      {
        name: "PostgreSQL",
        rating: 3
      },
      {
        name: "Jest",
        rating: 3
      }
    ],
    other: [
      {
        name: "Teaching",
        rating: 4
      },
      {
        name: "Psychology",
        rating: 4
      },
      {
        name: "Clean Code",
        rating: 4
      },
      {
        name: "Mathematics",
        rating: 4
      },
      {
        name: "Photoshop",
        rating: 3
      },
      {
        name: "Figma (UX/UI)",
        rating: 3
      }
    ]
  },
  education: [
    {
      title: "Online Courses and Mentorship",
      place: "Udemy and Personal Mentorship",
      period: "2022 - Present",
      description: [
        "Following various courses on Udemy to acquire knowledge",
        "Benefiting from the guidance of a friend as a mentor",
        "Working on projects that have allowed me to apply my skills"
      ]
    }
  ],
  experience: [
    {
      title: "Fullstack Developer",
      place: "Moneo Domus",
      period: "Since March 2024",
      description: [
        "Creation and design of a project management website from scratch (Next, PostgreSQL, Vercel) allowing my client to automate the management of their real estate renovation projects, reducing management costs by 50%"
      ]
    },
    {
      title: "Founder, Fullstack Developer and UX/UI Designer",
      place: "KAFO",
      period: "January 2023 - January 2024",
      description: [
        "Coded a no-code website (Weweb, Xano, JavaScript, MySQL) for rapid iteration and reduced development costs",
        "100% front-end recoding (Vue 3, TS) reducing site latency by 80%",
        "Integration of an interactive map (Mapbox) indexing hundreds of locations in Paris",
        "Interviewed 50 remote workers to understand their needs and practices. These interviews helped redefine the startup's approach by focusing more on the social aspect and isolation of remote workers rather than the need to find welcoming places",
        "UX user testing with 20 users. These tests helped understand the application's gaps and streamline the user experience"
      ]
    },
    {
      title: "Fullstack Developer",
      place: "Art Factory",
      period: "November 2023 - December 2023",
      description: [
        "Creation of a semi-private event management website from scratch (Next, PostgreSQL, Vercel). Time-saving and ease of use for users"
      ]
    },
    {
      title: "Fullstack Developer",
      place: "Aestima Immo / Real Estate Investment Simulator",
      period: "September 2022 - March 2024",
      description: [
        "Implementation of PDF export (scraping with Puppeteer) allowing users to export simulations. This feature doubled the number of premium subscriptions",
        "Implementation of team management (agency) and a new subscription",
        "Overhaul of the subscription system with Stripe allowing my client to simplify subscription management",
        "Infrastructure redesign (AWS EC2) reducing hosting costs by 80%",
        "Front-end code redesign (Vue 2) drastically reducing site latency (1s -> 100ms)",
        "Simplification of real estate rate updates and financial statement management by allowing my client to manage their data autonomously"
      ]
    }
  ],
  about: "Developer with a passion for innovation, I recently created and developed moneodomus.com, a complex web platform for managing real estate projects, allowing collaboration between different actors (agencies, builders, architects). Co-founder of KAFO, a startup dedicated to reducing the isolation of teleworkers, I rely on a previous experience of 6 years in the music industry that has given me a strong ability to adapt and creativity."
} 