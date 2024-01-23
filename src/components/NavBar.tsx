"use client"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList
} from "@/components/ui/navigation-menu"
import { Button } from "@/components/ui/button"
import { SunIcon, MoonIcon } from "lucide-react"

import Link from 'next/link'
import { useState } from 'react'


const NavBar = () => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (typeof window !== 'undefined') {
      document.body.classList.toggle('dark', !darkMode);
    }
  };

  return (
    <>
      <NavigationMenu orientation="vertical" className='items-start border-r-2 border h-full'>
        <NavigationMenuList className='flex flex-col items-start w-32 p-2'>
          <NavigationMenuItem>
            <Link href="/docs" legacyBehavior passHref>
              <NavigationMenuLink>
                Documentation
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/other" legacyBehavior passHref>
              <NavigationMenuLink>
                benco
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
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