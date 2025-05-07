import localFont from 'next/font/local'

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