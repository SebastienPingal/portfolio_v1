import ImageScrollDisplay from '@/components/image-scroll-display'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'

export default function LandingPage() {
  const images = [
    'https://uoeohmz1cojcdmtr.public.blob.vercel-storage.com/2025-02-11-181312_hyprshot-lv098JIqd5UlhQMndXGGzuZm0ZUar4.png',
    'https://uoeohmz1cojcdmtr.public.blob.vercel-storage.com/2025-02-11-181232_hyprshot-7RuXxRPGWI8hIdDGYRT4YOzDxi8PLs.png',
    'https://uoeohmz1cojcdmtr.public.blob.vercel-storage.com/2025-02-11-181222_hyprshot-T9fFidjoXUOdXCksUtR9lwFdW6y5ZV.png',
    'https://uoeohmz1cojcdmtr.public.blob.vercel-storage.com/2025-02-11-181957_hyprshot-O3vPith7QYZ9J8HjjIQSbyl1BbiiGW.png',
  ]
  return (
    <div className='flex flex-col gap-32 w-full mt-16'>
      <h1 className='text-7xl font-black text-center'>Mes projets</h1>

      <div className='flex flex-col gap-4 w-full'>
        <div className='flex flex-col gap-2'>
          <h2 className='text-6xl font-black'>Moneo Domus</h2>
          <p>Développeur Full Stack</p>
          <div>
            <ImageScrollDisplay images={images} height={600} />
          </div>
        </div >
      </div >
    </div >
  )
}