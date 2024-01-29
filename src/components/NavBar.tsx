"use client"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList
} from "@/components/ui/navigation-menu"
import { DownloadCloud, FileStack, Forklift, Github, Gitlab, Home, Linkedin, MoveUpRight, PencilRuler } from "lucide-react"

import { usePathname } from "next/navigation"

import { useSession } from "next-auth/react"
import Image from 'next/image'
import Link from 'next/link'

import { useTheme } from "next-themes"
import SigninButton from "./SigninButton"
import SignoutButton from "./SignoutButton"
import ThemeToggler from "./ThemeToggler"

const KafoWhite = '/Kafo_white.svg'
const KafoBlack = '/Kafo_black.svg'
const AestimaWhite = '/aestima_white.svg'
const AestimaBlack = '/aestima_black.svg'
const CerberesWhite = '/cerberes_white.svg'
const CerberesBlack = '/cerberes_black.svg'

const NavBar = () => {
  const session = useSession()
  const pathname = usePathname()
  const { theme } = useTheme()
  const darkMode = theme === 'dark'

  return (
    <>
      <NavigationMenu orientation="vertical" className='items-start shadow-inner h-full bg-card:10 backdrop-blur-xl'>
        <NavigationMenuList className='flex flex-col gap-5 items-start w-56 p-2'>
          <div className='text-2xl font-extrabold'>Sébastien Pingal</div>
          <div className="w-full">
            <NavigationMenuItem className={pathname === '/' ? 'bg-popover text-popover-foreground' : ''}>
              <Link href="/" className="w-full" legacyBehavior passHref>
                <NavigationMenuLink className="w-full">
                  <Home className="w-4 h-4" />Home
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </div>
          <div className='w-full'>
            <NavigationMenuItem className="font-extrabold mb-2">
              Me
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/stack" className="w-full" legacyBehavior passHref>
                <NavigationMenuLink className="w-full">
                  <PencilRuler className="w-4 h-4" /> Stack
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/other" className="w-full" legacyBehavior passHref>
                <NavigationMenuLink className="w-full">
                  <Forklift className="w-4 h-4" />Benco
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </div>
          <div className='w-full'>
            <NavigationMenuItem className="font-extrabold mb-2">
              Projects
            </NavigationMenuItem>
            <NavigationMenuItem>
              <a href="https://aestima-immo.com" target="_blank" rel="noreferrer" className="flex gap-4 items-center relative w-full">
                <Image src={darkMode ? AestimaWhite : AestimaBlack} alt="Aestima-immo" width={16} height={16} />Aestima-immo<MoveUpRight className="absolute right-0 w-4 h-4" />
              </a>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <a href="https://kafo.work" target="_blank" rel="noreferrer" className="flex gap-4 items-center relative w-full">
                <Image src={darkMode ? KafoWhite : KafoBlack} alt="Kafo" width={16} height={16} />Kafo<MoveUpRight className="absolute right-0 w-4 h-4" />
              </a>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <a href="https://cerberes.flamberger.zip" target="_blank" rel="noreferrer" className="flex gap-4 items-center relative w-full">
                <Image src={darkMode ? CerberesWhite : CerberesBlack} alt="cerberes" width={16} height={16} />Cerberes<MoveUpRight className="absolute right-0 w-4 h-4" />
              </a>
            </NavigationMenuItem>
          </div>
          <div className='w-full'>
            <NavigationMenuItem className="font-extrabold mb-2">
              Online
            </NavigationMenuItem>
            <NavigationMenuItem>
              <a href="https://www.linkedin.com/in/s%C3%A9bastien-pingal-582795b3/" target="_blank" rel="noreferrer" className="flex gap-4 items-center relative w-full">
                <Linkedin fill={darkMode ? 'white' : 'black'} className="w-4 h-4" />Linkedin<MoveUpRight className="absolute right-0 w-4 h-4" />
              </a>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <a href="https://github.com/SebastienPingal" target="_blank" rel="noreferrer" className="flex gap-4 items-center relative w-full">
                <Github className="w-4 h-4" />GitHub<MoveUpRight className="absolute right-0 w-4 h-4" />
              </a>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <a href="https://gitlab.com/Brume_" target="_blank" rel="noreferrer" className="flex gap-4 items-center relative w-full">
                <Gitlab className="w-4 h-4" />Gitlab<MoveUpRight className="absolute right-0 w-4 h-4" />
              </a>
            </NavigationMenuItem>
          </div>
          <div className='w-full'>
            <NavigationMenuItem hover={false}>
              <ThemeToggler />
            </NavigationMenuItem>
            <NavigationMenuItem hover={false}>
              {session.data ? (
                <div className="flex flex-col gap-2 justify-between items-center w-full">
                  <Image src={session.data.user?.image || ''} alt="profile" width={64} height={64} className="rounded-full" />
                  <p>{session.data.user?.name}</p>
                  <SignoutButton className="w-full" />
                </div>
              ) : (
                <SigninButton className="w-full" />
              )
              }
            </NavigationMenuItem>
          </div>
        </NavigationMenuList>
      </NavigationMenu>
    </>
  )
}

export default NavBar