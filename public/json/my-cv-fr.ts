import { CVData } from '@/types/CV'

export const frenchCV: CVData = {
  name: "Sébastien Pingal",
  about:
    "Développeur Full Stack TypeScript avec 4 ans d'expérience, spécialisé en Node.js, React, Next.js, Vue.js et PostgreSQL. J'interviens de bout en bout sur des produits web : architecture d'API REST, interfaces orientées produit, authentification, Docker et CI/CD. Habitué aux environnements startup, au développement from scratch et à la discovery produit.",
  title: "Développeur Full Stack TypeScript",
  subtitle: "Node.js · React · Next.js · Vue.js · PostgreSQL",
  coreSkills: [
    "Développeur Full Stack",
    "Développeur TypeScript",
    "Node.js",
    "React",
    "Next.js",
    "Vue.js",
    "PostgreSQL",
    "API REST",
    "Docker",
    "CI/CD"
  ],
  yearsOfExperience: 4,
  profileImage: "/img/seb8.jpg",
  profileImagePdf: "/img/seb8-pdf.jpg",
  // "profileImage": "/img/me_black.png",
  profileImageDark: "/img/seb8.jpg",
  profileImageDarkPdf: "/img/seb8-pdf.jpg",
  // "profileImageDark": "/img/me_white.png",
  activities: [
    "Musique (composition, batterie)",
    "Membre de l'association de jam musicale 'Majama'",
    "Jeu de rôle (Maître du jeu)",
    "Membre de l'association de jeu de rôle 'La boîte à chimère'",
    "VTT",
    "Lecture"
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
      { name: "Pédagogie", rating: 5 },
      { name: "UX/UI", rating: 5 },
      { name: "Design", rating: 4 },
      { name: "Mathématiques", rating: 4 }
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
      place: "Udemy et mentor personnel",
      title: "Formation continue en développement web",
      period: "Juin 2021 - Présent (4 ans)",
      description: [
        "Approfondissement de Vue.js, TypeScript et de la conception d'applications full stack.",
        "Mentorat technique et mise en pratique continue via des projets personnels."
      ]
    },
    { place: "Cifacom Montreuil", title: "Certification de monteur audiovisuel", period: "Septembre 2012 - Juin 2014", description: [] },
    { place: "Cifacom Montreuil", title: "Bachelor Réalisateur Audiovisuel", period: "Septembre 2012 - Juin 2014", description: [] },
    { place: "IUT de Cergy-Pontoise Sarcelles", title: "DUT Service et Réseaux de communication", period: "Septembre 2010 - Juin 2012", description: [] },
    { place: "Lycée Marien-Laurencin Mennecy", title: "Bac S", period: "Septembre 2007 - Juin 2010", description: [] }
  ],

  languages: [
    { name: "Français", level: "Natif" },
    { name: "Anglais", level: "Professionnel" }
    // { name: "Allemand", level: "Basique" }
  ],

  experience: [
    {
      link: "https://jolimoi.com/",
      order: 0,
      place: "Jolimoi",
      placeDescription: "Plateforme de social selling beauté (9 000 utilisateurs e-shop, 5 000 stylistes actifs).",
      title: "Développeur Full Stack (Vue.js, Node.js, TypeScript)",
      period: "Octobre 2025 - janvier 2026 (3 mois)",
      skills: ["TypeScript", "Vue.js", "Node.js", "MySQL", "PHP", "PrestaShop", "Docker", "Jest", "GitHub Actions", "Notion", "Linear", "Agile", "Scrum"],
      description: [
        "Mission courte sur une plateforme de social selling beauté générant 3 M€ de CA annuel, avec 9 000 utilisateurs e-shop et 5 000 stylistes actifs.",
        "- Amélioré l'expérience d'achat et le référencement en faisant évoluer PrestaShop sur les bons de réduction, la boutique cadeaux et les breadcrumbs SEO.",
        "- Renforcé le pilotage commercial avec un moteur de recommandation produit et des KPI de suivi styliste côté API Node.js/MySQL.",
        "- Rendu ces recommandations directement exploitables en intégrant leurs visualisations et actions front sur les différents sites."
      ]
    },
    {
      link: "https://moneodomus.com/",
      order: 1,
      place: "Moneo Domus",
      placeDescription: "Holding d'entreprises BTP - Apport d'affaires et accompagnement",
      title: "Développeur Full Stack (React.js, Node.js, TypeScript) / UX/UI",
      period: "Depuis janvier 2024 (1,5 ans)",
      skills: ["TypeScript", "React.js", "Next.js", "Node.js", "PostgreSQL", "NextAuth", "shadcn/ui", "Calendly API", "MagicLink", "PDF Generation", "Relation client", "Vercel"],
      description: [
        "Conçu et développé from scratch une plateforme SaaS pour un groupe BTP réalisant environ 500 k€ de CA mensuel, permettant une réduction de la charge opérationnelle de 50 %.",
        "- Fiabilisé la plateforme dès sa base en définissant l'architecture backend : API REST, validation, RBAC, PostgreSQL et conventions d'erreurs.",
        "- Réduit le temps de traitement opérationnel avec un frontend React/Next.js responsive intégrant formulaires métier, dashboards et composants shadcn/ui.",
        "- Fluidifié l'accès et la prise de rendez-vous multi-intervenants grâce à l'authentification Magic Link et à l'intégration Calendly.",
        "- Amélioré l'adoption produit en menant la discovery et les itérations UX avec agences, clients et entreprises BTP."
      ]
    },
    {
      link: "https://www.linkedin.com/company/kafowork/posts/?feedView=all",
      order: 2,
      place: "KAFO",
      placeDescription: "Réseau social pour télétravailleurs",
      title: "Fondateur / Développeur Full Stack (Vue.js, Node.js, PostgreSQL)",
      period: "Février 2023 - Septembre 2023 (8 mois)",
      skills: ["TypeScript", "Vue.js", "Node.js", "Xano", "Weweb", "Google Maps API", "AWS EC2", "GitHub CI/CD", "Primevue", "No-Code", "UX/UI", "UX Testing", "Agile", "Scrum"],
      description: [
        "Création d'une startup de réseau social pour télétravailleurs en 8 mois, avec plusieurs partenariats écoles/freelances et une visibilité presse jusqu'aux Echos.",
        "- Accéléré la validation de l'usage en prototypant le produit en no-code avec Xano et WeWeb.",
        "- Facilité la découverte de lieux adaptés au travail à distance avec une carte interactive et des filtres de recherche ciblés.",
        "- Amélioré la performance, la maintenabilité et la cohérence UI en reprenant ensuite le frontend en Vue 3.",
        "- Fiabilisé les mises en production et la boucle de feedback en déployant l'application sur AWS EC2 avec CI/CD GitHub et tests utilisateurs UX."
      ]
    },
    {
      link: "",
      order: 3,
      place: "Art Factory",
      title: "Développeur Full Stack (Next.js, Node.js, React.js, PostgreSQL) / UX/UI",
      period: "Novembre 2023 - Janvier 2024 (3 mois)",
      skills: ["TypeScript", "Next.js", "React.js", "Node.js", "PostgreSQL", "Express.js", "shadcn/ui", "TailwindCSS", "API Development"],
      description: [
        "Mission courte sur une application de gestion d'événements artistiques privés pour structurer l'outil côté front et back.",
        "- Structuré le suivi opérationnel avec une interface d'administration des événements et des dashboards en React/Next.js.",
        "- Accéléré la gestion des événements grâce à une API avec filtres, pagination, statuts et gestion des inscriptions.",
        "- Renforcé la cohérence UI et le contrôle d'accès avec une bibliothèque de composants et la gestion des rôles/permissions."
      ]
    },
    {
      link: "https://www.linkedin.com/company/aestima-immo/posts/",
      order: 4,
      place: "Aestima Immobilier",
      title: "Développeur Full Stack (Vue.js, Node.js, Express.js, PostgreSQL, Stripe)",
      period: "Juin 2021 - Décembre 2023 (2,5 ans)",
      skills: ["TypeScript", "Vue.js", "Node.js", "Express.js", "Stripe", "Primevue", "Axios", "Puppeteer", "Clean Code", "PDF Generation", "Refactoring", "Agile", "Scrum"],
      description: [
        "Refonte progressive d'une application legacy de simulation immobilière au sein d'une équipe de 3 développeurs full stack.",
        "- Gagné en cohérence, réactivité et maintenabilité en simplifiant les interfaces Vue 2 et en intégrant PrimeVue.",
        "- Rendu le backend Node.js/Express plus lisible et évolutif en refactorant la logique métier avec une meilleure séparation des responsabilités.",
        "- Sécurisé la facturation et élargi la couverture fonctionnelle en refondant Stripe et en ajoutant des fonctionnalités clés, dont la gestion d'équipe.",
        "- Accéléré la production des simulations clients avec des exports PDF personnalisés."
      ]
    },
    {
      order: 5,
      place: "Mon Bureau",
      title: "Projets personnels sélectionnés",
      period: "Depuis juin 2021 (4 ans)",
      skills: ["TypeScript", "Next.js", "React.js", "Node.js", "PostgreSQL", "Tailwind CSS", "shadcn/ui", "Docker", "Chrome Extension"],
      description: [
        "3 projets personnels sélectionnés pour expérimenter des produits, des interfaces et des architectures full stack.",
        "- Adventure terminale : développé un moteur de jeu de rôle textuel intégrant une IA générative qui crée dynamiquement des lieux, des environnements et des descriptions immersives.",
        "- Portfolio : accéléré la création de CV avec presets, génération PDF, i18n et backend Next.js/PostgreSQL.",
        "- DoctoNotes : enrichi l'expérience Doctolib via une extension Chrome/Firefox affichant les notes Google des praticiens.",
        "- Cerberes : validé une architecture de chat E2E minimaliste déployée avec Docker et CI/CD sur Raspberry Pi."
      ]
    },
    {
      link: "https://soundcloud.com/unbrouillard",
      order: 6,
      place: "Expérience antérieure (hors tech)",
      title: "Composition, ingénierie du son et montage vidéo",
      period: "2013 - 2021 (8 ans)",
      skills: ["Composition", "Audio Engineering", "Mix/Master", "Sound Design", "Video Editing"],
      description: [
        "Parcours freelance et créatif en composition musicale, sound design, mix/master et montage vidéo pour artistes, spectacles et contenus audiovisuels."
      ]
    }
  ]
}