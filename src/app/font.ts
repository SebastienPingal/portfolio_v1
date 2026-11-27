import localFont from 'next/font/local'
import { Nunito } from 'next/font/google'

export const cereal = localFont({
  src: [
    {
      path: '../../public/fonts/AirbnbCereal_W_Blk.otf',
      weight: '900',
      style: 'normal',
    },
    {
      path: '../../public/fonts/AirbnbCereal_W_XBd.otf',
      weight: '800',
      style: 'normal',
    },
    {
      path: '../../public/fonts/AirbnbCereal_W_Bd.otf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../public/fonts/AirbnbCereal_W_Md.otf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/AirbnbCereal_W_Bk.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/AirbnbCereal_W_Lt.otf',
      weight: '300',
      style: 'normal',
    },
  ],
  variable: '--font-cereal',
})

// 🫧 Rounded humanist face for the Aqua "glowing titles" effect (loaded on demand)
export const aquaRounded = Nunito({
  subsets: ['latin'],
  weight: ['700', '800', '900'],
  variable: '--font-aqua',
  display: 'swap',
  preload: false,
})
