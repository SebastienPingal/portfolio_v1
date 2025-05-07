import { useTranslations } from "next-intl"
import { Gallery6 } from "@/components/gallery6"

export default function Portfolio() {
  const t = useTranslations('Portfolio')

  const portfolioItems = [
    {
      id: "moneo-domus-1",
      title: "Moneo Domus",
      summary: "Property management platform with advanced features for real estate professionals.",
      url: "#",
      image: "https://uoeohmz1cojcdmtr.public.blob.vercel-storage.com/2025-02-11-181312_hyprshot-lv098JIqd5UlhQMndXGGzuZm0ZUar4.png",
    },
    {
      id: "moneo-domus-2",
      title: "Moneo Domus Dashboard",
      summary: "Interactive dashboard providing real-time analytics and property management tools.",
      url: "#",
      image: "https://uoeohmz1cojcdmtr.public.blob.vercel-storage.com/2025-02-11-181232_hyprshot-7RuXxRPGWI8hIdDGYRT4YOzDxi8PLs.png",
    },
    {
      id: "moneo-domus-3",
      title: "Moneo Domus Property View",
      summary: "Detailed property information interface with comprehensive management capabilities.",
      url: "#",
      image: "https://uoeohmz1cojcdmtr.public.blob.vercel-storage.com/2025-02-11-181222_hyprshot-T9fFidjoXUOdXCksUtR9lwFdW6y5ZV.png",
    },
    {
      id: "moneo-domus-4",
      title: "Moneo Domus Reports",
      summary: "Advanced reporting system for property performance analysis and financial tracking.",
      url: "#",
      image: "https://uoeohmz1cojcdmtr.public.blob.vercel-storage.com/2025-02-11-181957_hyprshot-O3vPith7QYZ9J8HjjIQSbyl1BbiiGW.png",
    },
    {
      id: "aestima-immo-1",
      title: "Aestima-Immo",
      summary: "Real estate valuation platform with AI-powered pricing models and market analysis.",
      url: "#",
      image: "https://uoeohmz1cojcdmtr.public.blob.vercel-storage.com/aestima5-XYkAYEUQAXdpqSpQraFT5rkqlfAm0w.jpeg",
    },
    {
      id: "aestima-immo-2",
      title: "Aestima-Immo Valuation Tool",
      summary: "Precise property valuation interface with comparable market data and trend analysis.",
      url: "#",
      image: "https://uoeohmz1cojcdmtr.public.blob.vercel-storage.com/aestima-znogA301RorJCc7BV74ebPQse8pR6W.webp",
    },
    {
      id: "aestima-immo-3",
      title: "Aestima-Immo Market Analysis",
      summary: "Comprehensive market analysis tools with interactive visualizations and data insights.",
      url: "#",
      image: "https://uoeohmz1cojcdmtr.public.blob.vercel-storage.com/aestima2-xjufnK8bQEt04WTjGO0zDgUjWc2yTL.webp",
    },
    {
      id: "aestima-immo-4",
      title: "Aestima-Immo Property Details",
      summary: "Detailed property information display with valuation history and market positioning.",
      url: "#",
      image: "https://uoeohmz1cojcdmtr.public.blob.vercel-storage.com/aestima3-DqjTznll5PshneKWlztic1Wm6yfbai.jpeg",
    },
    {
      id: "aestima-immo-5",
      title: "Aestima-Immo Reports",
      summary: "Professional reporting system for property valuations and market analysis documents.",
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