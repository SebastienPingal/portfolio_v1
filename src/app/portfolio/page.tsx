import { useTranslations } from "next-intl"
import { Gallery6 } from "@/components/gallery6"

export default function Portfolio() {
  const t = useTranslations('Portfolio')

  const portfolioItems = [
    {
      id: "moneo-domus-1",
      title: "Moneo Domus - Page d'administration",
      summary: "Page d'administration pour la gestion des utilisateurs, des agences immobilières et des sociétés de rénovations. Depuis cette page l'administrateur peut aussi choisir le mode d'assignation des sociétés de rénovations aux agences immobilières.",
      url: "#",
      image: "https://uoeohmz1cojcdmtr.public.blob.vercel-storage.com/2025-02-11-181312_hyprshot-lv098JIqd5UlhQMndXGGzuZm0ZUar4.png",
    },
    {
      id: "moneo-domus-2",
      title: "Moneo Domus - Creation d'une demande de travaux",
      summary: "La demande de travaux est guidée pas à pas et regroupe toutes les informations nécessaires pour la préparation du devis.",
      url: "#",
      image: "https://uoeohmz1cojcdmtr.public.blob.vercel-storage.com/2025-02-11-181232_hyprshot-7RuXxRPGWI8hIdDGYRT4YOzDxi8PLs.png",
    },
    {
      id: "moneo-domus-4",
      title: "Moneo Domus - Creation d'un devis",
      summary: "Le devis est généré en fonction des informations renseignées dans la demande de travaux.",
      url: "#",
      image: "https://uoeohmz1cojcdmtr.public.blob.vercel-storage.com/2025-02-11-181957_hyprshot-O3vPith7QYZ9J8HjjIQSbyl1BbiiGW.png",
    },
    {
      id: "kafo-1",
      title: "Kafo - Page Communauté",
      summary: "Depuis cette page, l'utilisateur peut entrer en contact avec d'autres utilisateurs et éventuellement organiser une session de travail.",
      url: "#",
      image: "https://uoeohmz1cojcdmtr.public.blob.vercel-storage.com/2025-05-07-113853_hyprshot-0SxM323JRX7618tlTxms0jCoSgNzxq.png",
    },
    {
      id: "kafo-2",
      title: "Kafo - Profil utilisateur",
      summary: "Depuis cette page, l'utilisateur peut modifier ses informations personnelles. Il peut indiquer ses centres d'intérêts et ses disponibilités.",
      url: "#",
      image: "https://uoeohmz1cojcdmtr.public.blob.vercel-storage.com/2025-05-07-113800_hyprshot-9G3rXIfDr4XNEYjcxZ0PWIIUDrma1F.png",
    },
    {
      id: "kafo-3",
      title: "Kafo - Carte interactive",
      summary: "La carte interactive permet de trouver des lieux publics favorables au travail. L'utilisateur peut filtrer les lieux en fonction de ses disponibilités et de ses centres d'intérêts.",
      url: "#",
      image: "https://uoeohmz1cojcdmtr.public.blob.vercel-storage.com/2025-05-07-113639_hyprshot-LKe6coKgfrGuY9nesa85EraqY2EVYQ.png",
    },
    {
      id: "kafo-5",
      title: "Kafo - Landing",
      summary: "La landing page de Kafo. Elle permet de présenter la plateforme et de convaincre les utilisateurs de l'utiliser.",
      url: "#",
      image: "https://uoeohmz1cojcdmtr.public.blob.vercel-storage.com/kafo2-uoZrWS0pr6Y218OAvLNmaH5rvghhJW.jpg",
    },
    {
      id: "aestima-immo-1",
      title: "Aestima-Immo - Page Tarification",
      summary: "Cette page a fait l'objet d'une refonte totale.",
      url: "#",
      image: "https://uoeohmz1cojcdmtr.public.blob.vercel-storage.com/aestima5-XYkAYEUQAXdpqSpQraFT5rkqlfAm0w.jpeg",
    },
    {
      id: "aestima-immo-2",
      title: "Aestima-Immo - Tableau de bord",
      summary: "Cette page permet de créer des profils clients, et de créer des projets qui leur seront associés.",
      url: "#",
      image: "https://uoeohmz1cojcdmtr.public.blob.vercel-storage.com/aestima-znogA301RorJCc7BV74ebPQse8pR6W.webp",
    },
    {
      id: "aestima-immo-4",
      title: "Aestima-Immo - Résumé d'un projet",
      summary: "Cette page permet de visualiser un résumé des résultats issus de la simulation d'un projet.",
      url: "#",
      image: "https://uoeohmz1cojcdmtr.public.blob.vercel-storage.com/aestima3-DqjTznll5PshneKWlztic1Wm6yfbai.jpeg",
    },
    {
      id: "aestima-immo-5",
      title: "Aestima-Immo - Rapport de simulation",
      summary: "Cette page extraite d'un fichier PDF généré par le simulateur, permet de visualiser les résultats de la simulation d'un projet.",
      url: "#",
      image: "https://uoeohmz1cojcdmtr.public.blob.vercel-storage.com/aestima4-zyfkQOWdKtHDNONA5pTOhIHSqbiLMD.jpeg",
    },
  ]

  return (
    <div>
      <h1>{t('title')}</h1>
      <Gallery6 items={portfolioItems} />
    </div>
  )
}