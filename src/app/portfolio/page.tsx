import { useTranslations } from "next-intl"
import { Gallery6 } from "@/components/gallery6"

// Titles and summaries live in messages/*.json under Portfolio.items.<id>
const PORTFOLIO_IMAGES = [
  { id: "moneo-domus-1", image: "https://uoeohmz1cojcdmtr.public.blob.vercel-storage.com/2025-02-11-181312_hyprshot-lv098JIqd5UlhQMndXGGzuZm0ZUar4.png" },
  { id: "moneo-domus-2", image: "https://uoeohmz1cojcdmtr.public.blob.vercel-storage.com/2025-02-11-181232_hyprshot-7RuXxRPGWI8hIdDGYRT4YOzDxi8PLs.png" },
  { id: "moneo-domus-4", image: "https://uoeohmz1cojcdmtr.public.blob.vercel-storage.com/2025-02-11-181957_hyprshot-O3vPith7QYZ9J8HjjIQSbyl1BbiiGW.png" },
  { id: "kafo-1", image: "https://uoeohmz1cojcdmtr.public.blob.vercel-storage.com/2025-05-07-113853_hyprshot-0SxM323JRX7618tlTxms0jCoSgNzxq.png" },
  { id: "kafo-2", image: "https://uoeohmz1cojcdmtr.public.blob.vercel-storage.com/2025-05-07-113800_hyprshot-9G3rXIfDr4XNEYjcxZ0PWIIUDrma1F.png" },
  { id: "kafo-3", image: "https://uoeohmz1cojcdmtr.public.blob.vercel-storage.com/2025-05-07-113639_hyprshot-LKe6coKgfrGuY9nesa85EraqY2EVYQ.png" },
  { id: "kafo-5", image: "https://uoeohmz1cojcdmtr.public.blob.vercel-storage.com/kafo2-uoZrWS0pr6Y218OAvLNmaH5rvghhJW.jpg" },
  { id: "aestima-immo-1", image: "https://uoeohmz1cojcdmtr.public.blob.vercel-storage.com/aestima5-XYkAYEUQAXdpqSpQraFT5rkqlfAm0w.jpeg" },
  { id: "aestima-immo-2", image: "https://uoeohmz1cojcdmtr.public.blob.vercel-storage.com/aestima-znogA301RorJCc7BV74ebPQse8pR6W.webp" },
  { id: "aestima-immo-4", image: "https://uoeohmz1cojcdmtr.public.blob.vercel-storage.com/aestima3-DqjTznll5PshneKWlztic1Wm6yfbai.jpeg" },
  { id: "aestima-immo-5", image: "https://uoeohmz1cojcdmtr.public.blob.vercel-storage.com/aestima4-zyfkQOWdKtHDNONA5pTOhIHSqbiLMD.jpeg" },
]

export default function Portfolio() {
  const t = useTranslations('Portfolio')

  const portfolioItems = PORTFOLIO_IMAGES.map(({ id, image }) => ({
    id,
    image,
    url: "#",
    title: t(`items.${id}.title`),
    summary: t(`items.${id}.summary`),
  }))

  return (
    <div>
      <h1>{t('title')}</h1>
      <Gallery6 items={portfolioItems} />
    </div>
  )
}
