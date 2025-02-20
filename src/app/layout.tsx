// Next.js and React imports
import type { Metadata } from "next"
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages } from 'next-intl/server'
import { GoogleTagManager } from "@next/third-parties/google"
import { motion } from "framer-motion"

// Local styles and fonts
import "./globals.css"
import { cereal } from './font'

// Local providers
import SessionProvider from "./SessionProvider"
import { ThemeProvider } from "./theme-provider"

// Components
import Navbar from "@/components/NavBar"
import PerlinBackground from "@/components/perlinBackground.jsx"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Toaster } from "@/components/ui/toaster"

// Icons
import { MenuIcon } from "lucide-react"

// Actions
import { getPosts, getExternalLinks } from "./actions"
import ThemeToggler from "@/components/ThemeToggler"
import LanguageSwitcher from "@/components/LanguageSwitcher"
import PageTransition from "@/components/PageTransition"

export const metadata: Metadata = {
  title: "Sébastien Pingal",
  description: "This is the website of Sébastien Pingal the developer fullstack and designer",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale()
  const messages = await getMessages()

  const workPosts = await getPosts("WORK")
  const blogPosts = await getPosts("BLOGPOST")
  const externalLinks = await getExternalLinks()

  return (
    <html lang={locale} suppressHydrationWarning>
      <GoogleTagManager gtmId="GTM-P42CZR92" />
      <body className={[
        cereal.className, 
        "flex flex-col sm:flex-row w-[100vw] h-[100vh] overflow-x-hidden overflow-y-auto relative",
        "[&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
      ].join(" ")}>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-P42CZR92"
            height="0" width="0" style={{ display: "none", visibility: "hidden" }} />
        </noscript>
        {/* End Google Tag Manager (noscript) */}

        <NextIntlClientProvider messages={messages} locale={locale}>

          <Toaster />
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
          >
            <SessionProvider>
              <div className="hidden sm:flex glassPanel fixed top-10 right-10 z-20 rounded-full">
                <ThemeToggler />
                <LanguageSwitcher />
              </div>

              <div className="sm:hidden flex glassPanel fixed rounded-full z-20 bottom-16 left-1/2 -translate-x-1/2">
                <ThemeToggler />
                <LanguageSwitcher />
              </div>

              <div className="sm:hidden z-20 w-full fixed backdrop-blur-md bottom-0">
                <DropdownMenu>
                  <DropdownMenuTrigger className="h-10 w-full" asChild >
                    <Button className="w-full rounded-none" asChild>
                      <p>
                        <MenuIcon /><span>Menu</span>
                      </p>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent sideOffset={0}>
                    <Navbar workPosts={workPosts} blogPosts={blogPosts} externalLinks={externalLinks} className="w-screen" />
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <Navbar workPosts={workPosts} blogPosts={blogPosts} externalLinks={externalLinks} className="hidden sm:flex fixed z-20" />

              <main className="flex-1 page z-10 w-full sm:w-max-5xl sm:w-[calc(100vw-14rem)] p-3 sm:p-8 sm:pt-16 sm:pt-8 sm:ml-[14rem] max-w-5xl sm:left-[calc(50%-7rem)] sm:-translate-x-1/2 relative">
                <PageTransition>
                  {children}
                </PageTransition>
              </main>

              <PerlinBackground overflow-x-scroll />
            </SessionProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
