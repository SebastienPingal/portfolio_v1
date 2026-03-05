import { CVData } from '@/types/CV'

export const frenchCV: CVData = {
  name: "Sébastien Pingal",
  about:
    "Développeur Full Stack JavaScript avec 4 ans d'expérience en développement logiciel (2021–présent). Spécialisé en TypeScript, Node.js, React, Next.js et Vue.js, je conçois des architectures d'API REST robustes et des interfaces modernes orientées produit. J'ai notamment conçu et développé moneodomus.com, une plateforme SaaS de gestion de projets immobiliers permettant la collaboration entre agences, constructeurs et architectes. Co-fondateur de KAFO, une startup visant à réduire l'isolement des télétravailleurs. Ancien compositeur et ingénieur du son (expérience antérieure, hors tech), je combine créativité, rigueur technique et sens du produit. Habitué aux environnements startup, au développement from-scratch, au DevOps (Docker, CI/CD) et à la conception d'architectures évolutives.",
  title: "Développeur Full Stack JavaScript",
  subtitle: "TypeScript · Node.js · React · Next.js · Vue.js · PostgreSQL",
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

  // 👇 Ajout pour optimisation ATS (scan rapide de mots-clés)
  coreKeywords: [
    "Full Stack Developer",
    "JavaScript Developer",
    "TypeScript",
    "Node.js",
    "React",
    "Next.js",
    "Vue.js",
    "REST API",
    "API Development",
    "SaaS Development",
    "Web Application Architecture",
    "PostgreSQL",
    "MySQL",
    "Docker",
    "CI/CD",
    "AWS",
    "Git",
    "Agile",
    "Scrum",
    "UX/UI",
    "Product Development",
    "Startup Environment"
  ],

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
      title: "Formations en ligne et mentorat",
      period: "Juin 2021 - Présent (4 ans)",
      description: [
        "Formation approfondie Vue.js et TypeScript",
        "Mentorat",
        "Réalisation de projets personnels pour mettre en pratique les compétences acquises"
      ]
    },
    { place: "Cifacom Montreuil", title: "Certification de monteur audiovisuel", period: "Septembre 2012 - Juin 2014", description: [] },
    { place: "Cifacom Montreuil", title: "Bachelor Réalisateur Audiovisuel", period: "Septembre 2012 - Juin 2014", description: [] },
    { place: "IUT de Cergy-Pontoise Sarcelles", title: "DUT Service et Réseaux de communication", period: "Septembre 2010 - Juin 2012", description: [] },
    { place: "Lycée Marien-Laurencin Mennecy", title: "Bac S", period: "Septembre 2007 - Juin 2010", description: [] }
  ],

  languages: [
    { name: "Français", level: "Langue maternelle" },
    { name: "Anglais", level: "Professionnel" }
    // { name: "Allemand", level: "Basique" }
  ],

  experience: [
    {
      link: "https://jolimoi.com/",
      order: 0,
      place: "Jolimoi",
      placeDescription:
        "Plateforme de social selling pour les produits de beauté. \n 9000 utilisateurs actifs sur la plateforme eshop \n 5000 stylistes actifs \n 3M€ de chiffre d'affaires par an",
      title: "Développeur Full Stack (Vue.js, Node.js, TypeScript)",
      period: "Octobre 2025 - janvier 2026 (3 mois)",
      skills: ["TypeScript", "Vue.js", "Node.js", "MySQL", "PHP", "PrestaShop", "Docker", "Jest", "GitHub Actions", "Notion", "Linear", "Agile", "Scrum"],
      description: [
        "- Développement et maintenance full stack d’un e-shop PrestaShop",
        "* Mise à jour et optimisation de composants PrestaShop",
        "* Implémentation des règles de bons de réduction et de la boutique cadeaux",
        "* Ajout de breadcrumbs sur les pages catégories et produits pour optimiser l’UX et le SEO",
        "- Développement back-end de l’API styliste et client (Node.js, MySQL)",
        "* Conception d’un système de recommandation de produits (Node.js, MySQL)",
        "* Ajout de KPI pour le suivi des performances des stylistes",
        "- Développement front-end des différents sites",
        "* Mise en page et visualisation des nouveaux KPI",
        "* Ajout d’actions pour accéder aux produits recommandés et leur affichage sur la page produit"
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
        "Conception d'une plateforme logicielle (SaaS) pour un holding d'entreprises en BTP. Le but était d'automatiser des tâches et ainsi de libérer 50% de charge de travail. MoneoDomus réalise environ 500 000€ de chiffre d'affaires par mois.",
        "- Développement frontend from scratch et responsive (React.js, shadcn/ui, TailwindCSS)",
        "* Formulaire de soumission de projet avec une UX streamlined",
        "* Dashboards",
        "- Développement backend from scratch (Node.js, Next.js, NextAuth, PostgreSQL)",
        "* Conception de l’architecture d’API REST (ressources, versioning, pagination, modèle d’erreurs uniformisé)",
        "* Définition des contrats et validation des entrées/sorties (schémas, cohérence métier)",
        "* Authentification par MagicLink et gestion des rôles/permissions (RBAC)",
        "* Conception et gestion d'une base de données PostgreSQL cohérente avec le domaine (Devis, Utilisateurs, Agences, Clients, Projets, Documents, Images…)",
        "* Intégration de fonctionnalités Calendly (Round Robin) pour la prise de rendez-vous multi-intervenants",
        "- Discovery produit avec les acteurs du secteur (agences immobilières, clients, sociétés BTP) pour définir les besoins et les fonctionnalités",
        "- Design UX/UI itératif des pages et composants selon les retours utilisateurs et les tests"
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
        "Création d'une startup : réseau social pour télétravailleurs. Partenariats avec plusieurs écoles privées et communautés de freelances (dont Freelance Republik). Un article est paru dans Les Echos dédié à la plateforme.",
        "- Développement backend no-code from scratch (Xano)",
        "* Gestion et génération d'événements",
        "* Scraping de Google Maps pour trouver et répertorier des lieux publics favorables au travail",
        "- Développement frontend no-code from scratch et responsive (Weweb)",
        "* Implémentation de la carte interactive avec filtres (\"Ouvert\", \"Dans un rayon de x kilomètres\", \"Actifs\"...)",
        "* Design, développement et wording d'une landing page",
        "- Refonte totale du front en Vue 3",
        "* Redev complet des fonctionnalités précédemment développées en no-code (optimisation perf + maintenance)",
        "* Implémentation d'une bibliothèque de composants (PrimeVue)",
        "* Développement de dashboards statistiques et administratifs",
        "- Mise en place et réalisation de tests utilisateurs UX",
        "- Déploiement avec CI/CD GitHub sur EC2 (AWS)"
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
        "Développement et maintenance d'une application de gestion d'événements artistiques privés pour une association (Next.js, Node.js, PostgreSQL).",
        "- Développement frontend (React, TailwindCSS)",
        "* Création d'une bibliothèque de composants (basée sur shadcn/ui)",
        "* Design et développement de dashboards statistiques",
        "* Design et développement d'une interface de gestion des événements (création, modification, suppression, consultation)",
        "- Développement backend (Node.js, Express, PostgreSQL)",
        "* Conception de l’API dédiée aux événements (modèle de domaine, endpoints, filtres/pagination, statuts)",
        "* Gestion des permissions et des rôles (RBAC)",
        "* Gestion des inscriptions aux événements et ateliers associés"
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
        "Refactorisation de fonctionnalités sur une application de simulation d'investissements immobiliers (équipe de 3 développeurs fullstack). Produit legacy nécessitant un nettoyage front et back complet.",
        "- Refonte frontend (Vue 2)",
        "* Simplification des interfaces pour améliorer réactivité et confort utilisateur",
        "* Intégration PrimeVue + modularisation pour cohérence et maintenance",
        "* Refonte de la landing page",
        "* Implémentation d'exports PDF personnalisés des simulations",
        "- Refonte du backend (Node.js, Express, Axios)",
        "* Refactor de la logique métier et déplacement côté backend (séparation contrôleurs/services, contrats d’API clarifiés)",
        "* Refonte du système de facturation (Stripe)",
        "* Ajout de fonctionnalités métier (gestion d'équipe et collaborateurs, dispositifs Malraux, etc.)"
      ]
    },
    {
      order: 5,
      place: "Mon Bureau",
      title: "Projets personnels",
      period: "Depuis juin 2021 (4 ans)",
      skills: ["TypeScript", "React.js", "Next.js", "PostgreSQL", "Tailwind CSS", "shadcn/ui", "i18n", "OAuth", "Perlin Noise", "Python", "Three.js", "Vue.js", "Docker", "Chrome Extension", "Firefox Extension"],
      description: [
        "Mon Portfolio (sebastienpingal.dev) : Création d'une application web de portfolio.",
        "- Développement full stack from scratch et responsive (React.js, shadcn/ui, TailwindCSS, Next.js, Node.js, PostgreSQL)",
        "* Éditeur de CV (versioning + presets)",
        "* Génération de bruit de Perlin pour un background dynamique",
        "* Bibliothèque de composants personnalisés",
        "* Gestion multilingue (i18n)",
        "- Développement backend from scratch (Next.js, Node.js, PostgreSQL)",
        "* Authentification OAuth (LinkedIn)",
        "* Conception et implémentation d’API REST (stacks, projets, presets de CV) + modularisation des données (PostgreSQL)",
        "- DoctoNotes : extension Chrome/Firefox affichant les notes Google des médecins sur Doctolib",
        "- Cerberes : chat minimaliste E2E (Vue3, Node.js, PostgreSQL, Docker, CI/CD) déployé sur Raspberry Pi",
        "- Livre 3D dynamique : React.js + Three.js (génération des pages via props)",
        "- Remake 2048 : Python (sans bibliothèque externe)"
      ]
    },
    {
      link: "https://soundcloud.com/unbrouillard",
      order: 6,
      place: "Brouillard — Expérience antérieure (hors tech)",
      title: "Compositeur / Ingénieur du son",
      period: "2015 - 2021 (6 ans)",
      skills: ["Audio Engineering", "Composition", "Mix/Master", "Sound Design", "Music Production"],
      description: ["Composition, mix/master de morceaux pour des artistes, films, jeux-vidéo et pièces de théâtre"]
    },
    {
      order: 7,
      place: "Freelance — Expérience antérieure (hors tech)",
      title: "Monteur Vidéo",
      period: "2013 - 2015 (2 ans)",
      skills: ["Video Editing", "Adobe Premiere", "Motion Graphics", "Post-Production"],
      description: [""]
    }
  ],

  // 👇 Bonus ATS (synonymes de rôle souvent utilisés par ATS + recruteurs)
  atsKeywords: [
    "Fullstack Developer",
    "Backend Developer",
    "Frontend Developer",
    "Software Engineer",
    "JavaScript Engineer",
    "TypeScript Developer",
    "Node.js Developer",
    "React Developer",
    "Next.js Developer",
    "Vue.js Developer"
  ]
}