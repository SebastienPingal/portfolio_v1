"use client"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList
} from "@/components/ui/navigation-menu"
import { DownloadCloud, Forklift, Home, MoonIcon, MoveUpRight, SunIcon } from "lucide-react"
import { usePathname } from "next/navigation"

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

const KafoWhite = '/Kafo_white.svg'
const KafoBlack = '/Kafo_black.svg'
const AestimaWhite = '/aestima_white.svg'
const AestimaBlack = '/aestima_black.svg'
const CerberesWhite = '/cerberes_white.svg'
const CerberesBlack = '/cerberes_black.svg'



const NavBar = () => {
  const pathname = usePathname()
  const [darkMode, setDarkMode] = useState(true)


  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    if (typeof window !== 'undefined') {
      document.body.classList.toggle('dark', !darkMode)
    }
  }

  return (
    <>
      <NavigationMenu orientation="vertical" className='items-start shadow-inner h-full bg-card:10 backdrop-blur-xl'>
        <NavigationMenuList className='flex flex-col gap-5 items-start w-56 p-2'>
          <div className='text-2xl font-extrabold'>Sébastien Pingal</div>
          <div className='w-full'>
            <NavigationMenuItem className="font-bold">
              Me
            </NavigationMenuItem>
            <NavigationMenuItem className={pathname === '/' ? 'bg-popover text-popover-foreground' : ''}>
              <Link href="/" legacyBehavior passHref>
                <NavigationMenuLink>
                  <Home className="w-4 h-4" />Home
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/docs" legacyBehavior passHref>
                <NavigationMenuLink>
                  <DownloadCloud className="w-4 h-4" /> Documentation
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/other" legacyBehavior passHref>
                <NavigationMenuLink>
                  <Forklift className="w-4 h-4" />Benco
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </div>
          <div className='w-full'>
            <NavigationMenuItem className="font-bold">
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
          <NavigationMenuItem>
            <Button onClick={toggleDarkMode} variant='outline'>
              {darkMode ? (
                <SunIcon />
              ) : (
                <MoonIcon />
              )}
            </Button>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </>
  )
}

export default NavBar