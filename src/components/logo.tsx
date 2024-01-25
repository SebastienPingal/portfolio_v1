"use client"
import { useTheme } from 'next-themes'
import Image from 'next/image'

const MeBlack = '/me_black.svg'
const MeWhite = '/me_white.svg'

const WebsiteLogo = ({ className }: { className: string }) => {
  const { theme } = useTheme()
  return (
    <div className={className + ' relative'}>
      <Image src={theme === 'dark' ? MeWhite : MeBlack} fill={true} alt='Sébastien' />
    </div>
  )
}

export default WebsiteLogo

