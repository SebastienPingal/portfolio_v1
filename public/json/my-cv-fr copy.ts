import { CVData } from '@/types/CV'

export const frenchCV: CVData = {
  name: "Sébastien Pingal",
  title: "Développeur Fullstack",
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
      name: "Français",
      level: "Langue maternelle"
    },
    {
      name: "Anglais",
      level: "Courant"
    },
    {
      name: "Allemand",
      level: "Niveau B2"
    }
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
        name: "Pédagogie",
        rating: 5
      },
      {
        name: "Ux/Ui",
        rating: 5
      },
      {
        name: "Design",
        rating: 4
      },
      {
        name: "Mathématiques",
        rating: 4
      }
    ]
  },
  education: [
    {
      title: "Formations en ligne et mentorat",
      place: "Udemy et mentor personnel",
      period: "2022 - Présent",
      description: [
        "Formation approfondie Vue.js et TypeScript",
        "Formation AWS et bonnes pratiques DevOps",
        "Mentorat",
        "Réalisation de projets personnels pour mettre en pratique les compétences acquises"
      ]
    }
  ],
  experience: [
    {
      title: "Développeur Full Stack",
      place: "Moneo Domus",
      period: "Depuis mars 2024",
      description: [
        "Création et design d'un SaaS de gestion de projet immobilier from scratch (React JS, Next JS, PostgreSQL, Vercel) reduisant les coûts de gestion de 50%",
        "Développement d'un système d'envoi de mails automatisé",
        "Implémentation d'une authentification sécurisée par Magic Link",
        "Création d'un module de facturation automatisé"
      ]
    },
    {
      title: "Fondateur, développeur Full Stack et UX/UI Designer",
      place: "KAFO",
      period: "Janvier 2023 - Janvier 2024",
      description: [
        "Codage d'un SaaS en no code (Weweb, Xano, JavaScript, MySQL) dans un but d'itération rapide et de réduction des coûts de développement",
        "Refonte du front (Vue 3, TS) permettant de réduire la latence du site de 80%",
        "Intégration d'une carte intéractive (Mapbox) indexant des centaines de lieux dans Paris",
        "Interview de 50 travailleurs en télétravail pour comprendre leurs besoins et leurs pratiques. Ces interviews ont permis de redéfinir l'angle d'attaque de la startup en se concentrant plus sur le coté social et de l'isolement des télétravailleurs que sur le besoin de trouver des lieux acceuillants.",
        "Tests utilisateurs UX de 20 utilisateurs. Ces test ont permis de comprendre les lacunes de l'application et de streamliner l'expérience utilisateur."
      ]
    },
    {
      title: "Développeur Full Stack",
      place: "Art Factory",
      period: "Novembre 2023 - Décembre 2023",
      description: [
        "Développement et maintenance d'un SaaS immobilier avec Vue 3 / Nuxt / TypeScript",
        "Mise en place d'une CI/CD avec GitHub Actions",
      ]
    },
    {
      title: "Développeur FullStack",
      place: "Aestima Immo",
      period: "Septembre 2022 - Mars 2024",
      description: [
        "Mise en place d'une CI/CD avec GitLab permettant des déploiements automatisés et sécurisés",
        "Refonte du code front (Vue 2) avec une architecture modulaire et des composants réutilisables, permettant de réduire drastiquement la latence du site (1s -> 100ms)",
        "Simplification de la mise a jour des différents taux immobiliers et de la gestion des états financiers en permettant a mon client de gérer ses données en autonomie via une interface Vue.js",
        "Implémentation d'export PDF (scraping avec Puppeteer) des simulations pour ce SaaS immobilier. Cette fonctionnalité a permis de doubler le nombre d'abonnements premium",
        "Implémentation d'une gestion de d'équipe (agence) et d'un nouvel abonnement.",
        "Refonte du systeme d'abonnement avec Stripe permettant a mon client de simplifier la gestion de ses abonnements.",
        "Refonte de l'infrastructure (AWS EC2) permettant de réduire les coûts d'hébergement de 80%"
      ]
    }
  ],
  about: "Développeur Full Stack passionné par l'innovation, j'ai récemment conçu et développé moneodomus.com une plateforme web complexe de gestion de projets immobiliers, permettant la collaboration entre différents acteurs du secteur (agences, constructeurs, architectes). Co-fondateur de KAFO, une startup dédiée à réduire l'isolement des télétravailleurs, je m'appuie sur une expérience précédente de 6 ans dans l'industrie musicale qui m'a doté d'une forte capacité d'adaptation et de créativité. Je suis à l'aise avec les technologies modernes comme Docker et CI/CD, et je suis toujours prêt à apprendre de nouvelles méthodes et langages."
} 