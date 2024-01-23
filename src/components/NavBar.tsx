"use client"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList
} from "@/components/ui/navigation-menu"
import { DownloadCloud, Forklift, Forward, Home, MoonIcon, MoveUpRight, SunIcon } from "lucide-react"
import { usePathname } from "next/navigation"

import Link from 'next/link'
import { useState } from 'react'


const NavBar = () => {
  const pathname = usePathname();
  console.log('pasthththththth', pathname)
  const [darkMode, setDarkMode] = useState(false);


  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (typeof window !== 'undefined') {
      document.body.classList.toggle('dark', !darkMode);
    }
  };

  return (
    <>
      <NavigationMenu orientation="vertical" className='items-start shadow-inner h-full bg-card'>
        <NavigationMenuList className='flex flex-col gap-5 items-start w-56 p-2'>
          <div className='text-2xl font-bold'>Sébastien Pingal</div>
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
              <Link href="/" legacyBehavior passHref>
                <NavigationMenuLink className="relative w-full">
                  <Home className="w-4 h-4" />Aestima-immo<MoveUpRight className="absolute right-0 w-4 h-4" />
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/docs" legacyBehavior passHref>
                <NavigationMenuLink className="relative w-full">
                  <DownloadCloud className="w-4 h-4" />Kafo<MoveUpRight className="absolute right-0 w-4 h-4" />
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/other" legacyBehavior passHref>
                <NavigationMenuLink className="relative w-full">
                  <Forklift className="w-4 h-4" />Cerberes<MoveUpRight className="absolute right-0 w-4 h-4" />
                </NavigationMenuLink>
              </Link>
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
  );
};

export default NavBar