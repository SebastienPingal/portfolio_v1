"use client"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList
} from "@/components/ui/navigation-menu"
import { FileText, BookUser, Github, Gitlab, Home, Linkedin, MoveUpRight, PencilRuler } from "lucide-react"
import React, { useEffect, useState } from "react"

import { useSession } from "next-auth/react"
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from "next/navigation"

import { useTheme } from "next-themes"
import SigninButton from "./SigninButton"
import SignoutButton from "./SignoutButton"
import ThemeToggler from "./ThemeToggler"

const logos = {
  Kafo: { white: '/img/Kafo_white.svg', black: '/img/Kafo_black.svg' },
  Aestima: { white: '/img/aestima_white.svg', black: '/img/aestima_black.svg' },
  Moneodomus: { white: '/img/moneodomus_white.png', black: '/img/moneodomus_black.png' }
}

import { Post } from "@prisma/client"
import PostSession from "./PostSession"

const NavBar = ({ workPosts, blogPosts, className }: { workPosts: Post[], blogPosts: Post[], className?: string }) => {
  const { data: session } = useSession()
  const pathname = usePathname()
  const { theme } = useTheme()
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    setDarkMode(theme === 'dark')
  }, [theme])

  const renderMenuItem = (href: string, icon: React.ReactNode, text: string) => (
    <NavigationMenuItem className={pathname === href ? 'bg-accent/40 text-popover-foreground' : ''}>
      <Link href={href} className="w-full" legacyBehavior passHref>
        <NavigationMenuLink className="w-full">
          {icon}{text}
        </NavigationMenuLink>
      </Link>
    </NavigationMenuItem>
  )

  const renderExternalLink = (href: string, icon: React.ReactNode, text: string) => (
    <NavigationMenuItem>
      <a href={href} target="_blank" rel="noreferrer" className="flex gap-4 items-center relative w-full">
        {icon}{text}<MoveUpRight className="absolute right-0 w-4 h-4" />
      </a>
    </NavigationMenuItem>
  )

  return (
    <nav>
      <NavigationMenu orientation="vertical" className={`${className} items-start shadow-inner h-full bg-card/20 backdrop-blur-md overflow-auto`}>
        <NavigationMenuList className='flex flex-col gap-1 items-start p-2 w-screen sm:w-56'>
          <div className='text-2xl font-extrabold w-full'>Sébastien Pingal</div>

          {renderMenuItem('/', <Home className="w-4 h-4" />, 'Home')}

          <div className='w-full'>
            <NavigationMenuItem className="font-extrabold mb-2">Me</NavigationMenuItem>
            {renderMenuItem('/stack', <PencilRuler className="w-4 h-4" />, 'Stack')}
            {renderMenuItem('/cv', <FileText className="w-4 h-4" />, 'CV')}
          </div>

          <div className='w-full'>
            <NavigationMenuItem className="font-extrabold mb-2">Projects</NavigationMenuItem>
            {Object.entries(logos).map(([name, { white, black }]) => (
              renderExternalLink(
                `https://${name.toLowerCase()}.${name === 'Kafo' ? 'work' : 'com'}`,
                <Image src={darkMode ? white : black} alt={name} width={16} height={16} />,
                name
              )
            ))}
          </div>

          {(workPosts.length > 0 || session?.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL) && (
            <PostSession posts={workPosts} type="WORK" subSlug="work" title="Works" />
          )}

          {(blogPosts.length > 0 || session?.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL) && (
            <PostSession posts={blogPosts} type="BLOGPOST" subSlug="blog" title="Writing" />
          )}

          <div className='w-full'>
            <NavigationMenuItem className="font-extrabold mb-2">Gadgets</NavigationMenuItem>
            {renderMenuItem('/cv-sebifyer', <BookUser className="w-4 h-4" />, 'CV Sebifyer')}
          </div>

          <div className='w-full'>
            <NavigationMenuItem className="font-extrabold mb-2">Online</NavigationMenuItem>
            {renderExternalLink("https://www.linkedin.com/in/s%C3%A9bastien-pingal-582795b3/", <Linkedin fill={darkMode ? 'white' : 'black'} className="w-4 h-4" />, 'Linkedin')}
            {renderExternalLink("https://github.com/SebastienPingal", <Github className="w-4 h-4" />, 'GitHub')}
            {renderExternalLink("https://gitlab.com/Brume_", <Gitlab className="w-4 h-4" />, 'Gitlab')}
          </div>

          <div className='w-full'>
            <NavigationMenuItem hover={false}><ThemeToggler /></NavigationMenuItem>
            <NavigationMenuItem hover={false}>
              {session ? (
                <div className="flex flex-col gap-2 justify-between items-center w-full">
                  <Image src={session.user?.image || ''} alt="profile" width={64} height={64} className="rounded-full" />
                  <p>{session.user?.name}</p>
                  <SignoutButton className="w-full" />
                </div>
              ) : (
                <SigninButton className="w-full" />
              )}
            </NavigationMenuItem>
          </div>
        </NavigationMenuList>
      </NavigationMenu>
    </nav>
  )
}

export default NavBar
